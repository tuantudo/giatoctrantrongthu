fetch("https://api.giatoctrantrongthu.com/api/genealogy.json").then(r => r.json()).then(data => {
    let memories = [];
    Object.values(data.people).forEach(p => {
        if (p.memory) memories.push({name: p.name, mem: p.memory});
    });
    console.log("Individuals:", Object.keys(data.people).length);
    console.log("Memories found:", memories.length);
    if(memories.length > 0) console.log("Sample memory:", memories[0]);
});
