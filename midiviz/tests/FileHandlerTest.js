const handler = new FileHandler();
handler.loadMidi("./assets/reminiscene.mid").then(() => {
    //test basic functions
    console.log(handler.getTrackName(0));
    console.log(handler.getTrackNotes(0));

    //test convertToP5Notes
    let p5Notes = handler.convertToP5Notes(0);
    console.log(p5Notes);
})





