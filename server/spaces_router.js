/**
 * server/spaces_router.js
 * Implementation of the Three Experience Spaces & Development Access Adapter
 * 
 * Space 01: Public / Social
 * Space 02: Lineage / Member Space
 * Space 03: Personal & Family Space (Layer 01 Myself, Layer 02 Close Family, Layer 03 Extended Sibling Families, Special Private Space)
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

function createSpacesRouter(dbAccessor) {
    const router = express.Router();

    const allQuery = (q, p) => dbAccessor.allQuery(q, p);
    const getQuery = (q, p) => dbAccessor.getQuery(q, p);

    // Development Access Adapter Middleware
    function devAccessAdapter(req, res, next) {
        const isLocalDev = (req.hostname === 'localhost' || req.hostname === '127.0.0.1') && 
                            process.env.NODE_ENV !== 'production';
        
        let persona = 'public';
        if (isLocalDev) {
            // Check query param, header, or cookie
            const requestedPersona = req.query.persona || req.headers['x-dev-persona'] || req.cookies?.dev_persona;
            if (['public', 'member', 'individual', 'family'].includes(requestedPersona)) {
                persona = requestedPersona;
            } else if (req.session?.accountId) {
                persona = 'member';
            }
        } else {
            // Production strictly uses real authenticated session
            if (req.session?.accountId) {
                persona = req.session.status === 'VERIFIED_MEMBER' ? 'family' : 'member';
            } else {
                persona = 'public';
            }
        }

        req.devPersona = persona;
        req.isLocalDev = isLocalDev;
        next();
    }

    router.use(devAccessAdapter);

    // Endpoint: Get current persona context
    router.get('/context', (req, res) => {
        res.json({
            persona: req.devPersona,
            isLocalDev: req.isLocalDev,
            availablePersonas: [
                { id: 'public', label: 'Khách công chúng', space: 'Space 01: Public / Social' },
                { id: 'member', label: 'Thành viên dòng họ', space: 'Space 02: Lineage / Member' },
                { id: 'individual', label: 'Bản thân (Myself)', space: 'Space 03: Layer 01 Myself' },
                { id: 'family', label: 'Gia đình gần gũi', space: 'Space 03: Layer 02 & 03 Family' }
            ]
        });
    });

    // ==========================================
    // SPACE 01 — PUBLIC / SOCIAL DATA CONTRACT
    // ==========================================
    router.get('/public', async (req, res) => {
        try {
            // 1. Stories: load public MẠCH (exclude Clara)
            let publicStories = [];
            const machDataFile = path.join(__dirname, 'data', 'mach.json');
            if (fs.existsSync(machDataFile)) {
                const machJson = JSON.parse(fs.readFileSync(machDataFile, 'utf8'));
                publicStories = (machJson.stories || []).filter(s => 
                    !s.id?.startsWith('clara') && !s.id?.startsWith('art_clara') && s.seriesSlug !== 'thu-gui-clara'
                );
            }

            // 2. Heritage statistics (counts only, no living person names or PII)
            const countPeople = await getQuery("SELECT COUNT(*) as count FROM people WHERE status = 'PUBLISHED'");
            const countFamilies = await getQuery("SELECT COUNT(*) as count FROM families WHERE status = 'PUBLISHED'");
            const countMemories = await getQuery("SELECT COUNT(*) as count FROM memories");

            // 3. Public cultural milestones
            const rawTimeline = await allQuery("SELECT id, date, event, payload FROM timeline ORDER BY date ASC LIMIT 10");
            const timelineRows = rawTimeline.map(r => {
                let p = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
                return {
                    id: r.id,
                    date: r.date,
                    title: r.event || p.title || p.event || 'Sự kiện gia tộc',
                    description: p.description || p.notes || '',
                    icon: p.icon || 'star'
                };
            });

            res.json({
                space: 'public',
                identity: {
                    title: 'Gia Tộc Trần Trọng Thu',
                    tagline: 'Ấn phẩm số & Kho lưu trữ sống của dòng họ',
                    narrative: 'Một dòng họ giữ nếp nhà, ký ức và câu chuyện qua nhiều thế hệ — từ những năm đầu định hình cho đến hôm nay.',
                    manifesto: 'Gìn giữ cội nguồn, phát huy truyền thống, kết nối tình thân tộc.'
                },
                stats: {
                    individuals: countPeople?.count || 223,
                    families: countFamilies?.count || 68,
                    memories: countMemories?.count || 2
                },
                curatedStories: publicStories.slice(0, 5),
                allPublicStories: publicStories,
                heritageMilestones: timelineRows,
                recognitionGate: {
                    isMemberRecognized: req.devPersona !== 'public',
                    title: 'Cửa ngõ xác thực thành viên dòng họ',
                    description: 'Không gian gia phả chi tiết, lịch kỵ giỗ và kho tư liệu đời sống gia đình được bảo vệ dành riêng cho con cháu nội ngoại.',
                    actions: [
                        { label: 'Tư cách thành viên', href: '#/tu-cach-thanh-vien' },
                        { label: 'Đăng nhập', href: '/login' }
                    ]
                }
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // ==========================================
    // SPACE 02 — LINEAGE / MEMBER DATA CONTRACT
    // ==========================================
    router.get('/member', async (req, res) => {
        // Enforce membership context
        if (req.devPersona === 'public') {
            return res.status(403).json({
                error: 'MEMBER_SPACE_PROTECTED',
                message: 'Không gian Dòng họ yêu cầu xác thực tư cách thành viên.',
                gate: 'SPACE_02_RECOGNITION_GATE'
            });
        }

        try {
            // 1. Genealogy data
            const peopleRows = await allQuery("SELECT * FROM people WHERE status = 'PUBLISHED'");
            const familyRows = await allQuery("SELECT * FROM families");
            const timelineRows = await allQuery("SELECT * FROM timeline ORDER BY date ASC");
            const memoryRows = await allQuery("SELECT * FROM memories");

            let peopleMap = {};
            for (let r of peopleRows) {
                let p = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
                p.id = r.id;
                p.name = r.name;
                peopleMap[r.id] = p;
            }

            let familiesMap = {};
            for (let r of familyRows) {
                let f = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
                f.id = r.id;
                f.husband_id = f.husband || r.husband_id;
                f.wife_id = f.wife || r.wife_id;
                f.children = f.children || [];
                familiesMap[r.id] = f;
            }

            // 2. Media archive
            const mediaRows = await allQuery("SELECT * FROM media");
            let mediaList = mediaRows.map(r => {
                let m = r.payload ? (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) : {};
                return {
                    id: r.id,
                    file: m.file || r.file_path || '',
                    title: m.title || `Tư liệu số ${r.id}`,
                    mimeType: m.mimeType || r.mime_type || 'image/jpeg',
                    date: m.date || 'Tư liệu lưu trữ'
                };
            });

            // 3. Calendar summary: 4 feeds
            const calendarFeeds = [
                { key: 'birthdays', file: '/api/calendars/CAL_01_BIRTHDAYS.ics', label: 'Sinh nhật thành viên' },
                { key: 'patrons', file: '/api/calendars/CAL_02_PATRON_FEASTS.ics', label: 'Ngày lễ Bổn mạng' },
                { key: 'memorials', file: '/api/calendars/CAL_03_MEMORIALS.ics', label: 'Kỵ giỗ Tiền nhân' },
                { key: 'milestones', file: '/api/calendars/CAL_04_FAMILY_MILESTONES.ics', label: 'Sự kiện dòng họ' }
            ];

            res.json({
                space: 'member',
                activePersona: req.devPersona,
                rootAnchor: '@I1@',
                people: peopleMap,
                families: familiesMap,
                timeline: timelineRows,
                memories: memoryRows,
                mediaArchive: mediaList,
                calendarFeeds: calendarFeeds,
                stats: {
                    individuals: peopleRows.length,
                    families: familyRows.length,
                    mediaCount: mediaList.length,
                    timelineEvents: timelineRows.length
                }
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    // ==========================================
    // SPACE 03 — PERSONAL & FAMILY DATA CONTRACT
    // ==========================================
    router.get('/personal', async (req, res) => {
        // Enforce individual or family context
        if (req.devPersona === 'public') {
            return res.status(403).json({
                error: 'PERSONAL_SPACE_PROTECTED',
                message: 'Không gian Cá nhân & Gia đình yêu cầu xác thực gia đình.',
                gate: 'SPACE_03_PERSONAL_GATE'
            });
        }

        try {
            // Anchor person defaults to @I1@ (Giuse Trần Trọng Thu) or specified in query
            const personId = req.query.personId || '@I1@';

            // Query anchor person
            const targetRow = await getQuery("SELECT * FROM people WHERE id = ?", [personId]);
            if (!targetRow) return res.status(404).json({ error: 'Person not found' });

            const myselfPayload = targetRow.payload ? 
                (typeof targetRow.payload === 'string' ? JSON.parse(targetRow.payload) : targetRow.payload) : {};
            
            function extractYear(val, fallback) {
                if (!val) return fallback;
                if (typeof val === 'string') return val;
                if (typeof val === 'object') return val.date || val.year || fallback;
                return String(val);
            }

            // LAYER 01 — MYSELF
            const layer01 = {
                id: targetRow.id,
                name: targetRow.name,
                birth: extractYear(myselfPayload.birth, myselfPayload.birthYear || '1906'),
                death: extractYear(myselfPayload.death, myselfPayload.deathYear || '1987'),
                generation: myselfPayload.generation || 1,
                branch: myselfPayload.branch || 'Trưởng',
                bio: myselfPayload.bio || myselfPayload.summary || 'Cụ Giuse Trần Trọng Thu — bậc khai sáng nếp nhà và phả hệ.',
                memories: myselfPayload.memory ? [myselfPayload.memory] : [],
                personalNotes: 'Ghi chép và ký ức cá nhân được lưu giữ trong không gian riêng.'
            };

            // Retrieve all families for relationship traversal
            const allFamRows = await allQuery("SELECT * FROM families");
            const allPeopleRows = await allQuery("SELECT id, name, payload FROM people");
            
            const peopleLookup = {};
            for (let p of allPeopleRows) {
                let parsed = p.payload ? (typeof p.payload === 'string' ? JSON.parse(p.payload) : p.payload) : {};
                peopleLookup[p.id] = { id: p.id, name: p.name, ...parsed };
            }

            // Find parents family (where myself is a child)
            let parentsFamily = null;
            // Find own families (where myself is husband or wife)
            let ownFamilies = [];

            for (let f of allFamRows) {
                let parsed = f.payload ? (typeof f.payload === 'string' ? JSON.parse(f.payload) : f.payload) : {};
                let children = parsed.children || [];
                let husband = parsed.husband || f.husband_id;
                let wife = parsed.wife || f.wife_id;

                if (children.includes(personId)) {
                    parentsFamily = { ...parsed, husband, wife, children };
                }
                if (husband === personId || wife === personId) {
                    ownFamilies.push({ ...parsed, husband, wife, children });
                }
            }

            // LAYER 02 — CLOSE FAMILY
            const parents = [];
            const siblings = [];
            if (parentsFamily) {
                if (parentsFamily.husband && peopleLookup[parentsFamily.husband]) {
                    parents.push({ relation: 'Cha', ...peopleLookup[parentsFamily.husband] });
                }
                if (parentsFamily.wife && peopleLookup[parentsFamily.wife]) {
                    parents.push({ relation: 'Mẹ', ...peopleLookup[parentsFamily.wife] });
                }
                for (let childId of parentsFamily.children) {
                    if (childId !== personId && peopleLookup[childId]) {
                        siblings.push({ relation: 'Anh/Chị/Em ruột', ...peopleLookup[childId] });
                    }
                }
            }

            const spouses = [];
            const childrenList = [];
            for (let ofam of ownFamilies) {
                let spouseId = ofam.husband === personId ? ofam.wife : ofam.husband;
                if (spouseId && peopleLookup[spouseId]) {
                    spouses.push({ relation: 'Vợ/Chồng', ...peopleLookup[spouseId] });
                }
                for (let chId of ofam.children) {
                    if (peopleLookup[chId]) {
                        childrenList.push({ relation: 'Con', ...peopleLookup[chId] });
                    }
                }
            }

            const layer02 = {
                title: 'Gia đình hạt nhân (Close Family)',
                parents: parents,
                spouses: spouses,
                children: childrenList,
                siblings: siblings
            };

            // LAYER 03 — EXTENDED SIBLING FAMILIES
            const siblingFamilies = [];
            for (let sib of siblings) {
                // Find families of this sibling
                for (let f of allFamRows) {
                    let parsed = f.payload ? (typeof f.payload === 'string' ? JSON.parse(f.payload) : f.payload) : {};
                    let husband = parsed.husband || f.husband_id;
                    let wife = parsed.wife || f.wife_id;
                    let chs = parsed.children || [];
                    if (husband === sib.id || wife === sib.id) {
                        let inLawId = husband === sib.id ? wife : husband;
                        siblingFamilies.push({
                            sibling: sib,
                            inLaw: inLawId && peopleLookup[inLawId] ? { relation: 'Dâu/Rể', ...peopleLookup[inLawId] } : null,
                            nephewsNieces: chs.map(id => peopleLookup[id]).filter(Boolean).map(c => ({ relation: 'Cháu', ...c }))
                        });
                    }
                }
            }

            const layer03 = {
                title: 'Gia đình anh chị em mở rộng (Extended Sibling Families)',
                families: siblingFamilies
            };

            // SPECIAL PRIVATE SPACES (THƯ GỬI CLARA)
            let specialPrivateSpace = null;
            if (req.devPersona === 'family') {
                const claraFile = path.join(__dirname, 'data', 'private', 'clara.json');
                if (fs.existsSync(claraFile)) {
                    const claraData = JSON.parse(fs.readFileSync(claraFile, 'utf8'));
                    specialPrivateSpace = {
                        spaceId: 'thu-gui-clara',
                        title: 'Thư Gửi Clara',
                        discourseScope: 'clara',
                        description: 'Không gian ký ức riêng tư của gia đình, tách biệt hoàn toàn khỏi công luận và trang phả hệ công khai.',
                        letterCount: (claraData.stories || []).length,
                        letters: (claraData.stories || []).map(s => ({
                            id: s.id,
                            title: s.title,
                            date: s.date,
                            preview: s.preview || s.deck || 'Thư riêng gia đình lưu trữ.',
                            fullAvailable: true
                        }))
                    };
                }
            } else {
                specialPrivateSpace = {
                    spaceId: 'thu-gui-clara',
                    title: 'Không gian Ký ức Gia đình',
                    accessible: false,
                    note: 'Không gian này chỉ xuất hiện trong ngữ cảnh gia đình phù hợp (Persona: Family Context).'
                };
            }

            res.json({
                space: 'personal_and_family',
                activePersona: req.devPersona,
                anchorPersonId: personId,
                layer01_myself: layer01,
                layer02_close_family: layer02,
                layer03_extended_sibling_families: layer03,
                specialPrivateSpace: specialPrivateSpace
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    return router;
}

module.exports = { createSpacesRouter };
