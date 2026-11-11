function renderHomePublicationLanding() {
    if (!appData) return;

    const people = appData.people || {};
    const stats = appData.stats || { individuals: Object.keys(people).length, families: Object.keys(appData.families || {}).length, memories: (appData.memories || []).length };

    // 1. Lead Story — Featured article from MẠCH
    const leadStory = document.getElementById("homeLeadStory");
    if (leadStory && machData && (machData.articles || machData.stories)) {
        const allArticles = machData.articles || machData.stories;
        const featured = allArticles.find(a => a.featured === true) || allArticles[0];

        if (featured) {
            const heroMedia = machData.media && machData.media[featured.heroMediaId];
            const imageUrl = heroMedia ? heroMedia.src : (featured.heroImage || featured.coverImage || featured.hero || '');

            const imgEl = document.getElementById("leadStoryImage");
            if (imgEl) {
                imgEl.style.backgroundImage = imageUrl ? `url('${imageUrl}')` : '';
            }

            const tagEl = document.getElementById("leadStoryTag");
            if (tagEl) tagEl.textContent = 'MẠCH';

            const titleEl = document.getElementById("leadStoryTitle");
            if (titleEl) titleEl.textContent = featured.title || '';

            const deckEl = document.getElementById("leadStoryDeck");
            if (deckEl) deckEl.textContent = featured.deckLead || featured.excerpt || featured.subtitle || '';

            const metaEl = document.getElementById("leadStoryMeta");
            if (metaEl) {
                const dateStr = featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString('vi-VN') : '';
                metaEl.innerHTML = dateStr ? `<span>${dateStr}</span>` : '';
            }

            leadStory.onclick = () => navigateRoute(`/mach/bai-viet/${featured.slug}`);
        }
    }

    // 2. MẠCH Section Grid — first 3 articles
    const machGrid = document.getElementById("machSectionGrid");
    if (machGrid && machData && (machData.articles || machData.stories)) {
        const articles = (machData.articles || machData.stories || []).slice(0, 3);
        machGrid.innerHTML = articles.map(a => {
            const heroMedia = machData.media && machData.media[a.heroMediaId];
            const imgUrl = heroMedia ? heroMedia.src : (a.heroImage || a.coverImage || a.hero || '');
            const imgStyle = imgUrl ? `background-image:url('${imgUrl}')` : '';
            const deck = (a.deckLead || a.excerpt || '').slice(0, 100);

            return `
                <article class="mach-card" onclick="navigateRoute('/mach/bai-viet/${a.slug}')">
                    <div class="mach-card-image" style="${imgStyle}"></div>
                    <h3 class="mach-card-title">${escapeHtml(a.title || '')}</h3>
                    <p class="mach-card-deck">${escapeHtml(deck)}${deck.length >= 100 ? '...' : ''}</p>
                </article>
            `;
        }).join('');
    }

    // 3. Ký Ức & Ghi chép — from appData.memories (real data, no fake content)
    const kyUcCard = document.getElementById("kyUcCard");
    if (kyUcCard) {
        const memories = appData.memories || [];
        if (memories.length > 0) {
            const mem = memories[0];
            // Clean title: remove emoji prefix if present
            const rawTitle = mem.title || 'Ký ức gia tộc';
            const title = rawTitle.replace(/^[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2B00-\u2BFF\uFE0F]+\s*/u, '').trim() || rawTitle;
            // Truncate story to ~200 chars for homepage excerpt
            const story = mem.story || '';
            const excerpt = story.length > 200 ? story.slice(0, 200).trim() + '...' : story;
            const personName = mem.personName || '';

            kyUcCard.innerHTML = `
                <h3 class="ky-uc-title">${escapeHtml(title)}</h3>
                ${personName ? `<div class="ky-uc-meta">— ${escapeHtml(personName)}</div>` : ''}
                <p class="ky-uc-excerpt">${escapeHtml(excerpt)}</p>
                <a href="#/gia-pha/ky-uc" class="ky-uc-cta" onclick="navigateRoute('/gia-pha/ky-uc')">Đọc toàn bộ ký ức →</a>
            `;
        } else {
            kyUcCard.innerHTML = '<p class="ky-uc-excerpt">Chưa có ghi chép ký ức nào được số hóa.</p>';
        }
    }

    // 4. Sidebar Calendar — reuse calEvents from existing calendar pipeline
    renderSidebarCalendar();

    // 5. Gia Phả Stats — from appData.stats + derivedGenerations (real data)
    const indEl = document.getElementById("statIndividuals");
    const famEl = document.getElementById("statFamilies");
    const genEl = document.getElementById("statGenerations");
    if (indEl) indEl.textContent = stats.individuals || Object.keys(people).length || '—';
    if (famEl) famEl.textContent = stats.families || Object.keys(appData.families || {}).length || '—';
    if (genEl) {
        // Compute generation count from derivedGenerations (populated by deriveFamilyGraphGenerations)
        const genLevels = Object.values(derivedGenerations).filter(l => l !== undefined && l !== null);
        if (genLevels.length > 0) {
            const maxGen = Math.max(...genLevels);
            const minGen = Math.min(...genLevels);
            // Total generations = max - min + 1 (including negative levels for ancestors)
            const totalGens = maxGen - minGen + 1;
            genEl.textContent = totalGens > 0 ? totalGens : '—';
        } else {
            genEl.textContent = '—';
        }
    }
}

    const machMeta = document.getElementById("homeMachMeta");
    if (machMeta && machData) {
        const articleCount = (machData.articles || machData.stories || []).length;
        const seriesCount = Object.keys(machData.series || {}).length;
        machMeta.innerText = `${articleCount} bài viết & tự sự · ${seriesCount} tuyển tập`;
    }

    const archiveMeta = document.getElementById("homeArchiveMeta");
    if (archiveMeta) {
        // Honest empty/in-progress state - do not claim unindexed items or display "0 hiện vật"
        archiveMeta.innerText = "Đang sưu tầm & số hóa tư liệu";
    }

}
