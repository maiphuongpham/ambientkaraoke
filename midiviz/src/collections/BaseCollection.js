class Collection {
    /** 
    @description Array of primitives
    */
    collection;

    /** 
    @description Current callback of this collection when a note is being played
    */
    onNotePlayed;

    /** 
    @description Current callback of this collection when a note ends playing
    */
    onNoteEnded;

    /** 
    @description If the collection listen to all tracks' events.
    */
    listenToAll;

    /** 
    @description The track index this collection listens to. Each colleciton is associated with one track by default.
    */
    trackIdx;

    /** 
    @description The initial acceleration of the collection is multiplied by this amount
    */
    speed_scale;

    /**
    @description How the color is determined in the defaultOnNotePlayed callback, takes in note detail, returns the color, int[3]
    */
    colorGenerator;

    
    setTrackIdx(trackIdx) {
        this.trackIdx = trackIdx;
    }

    setSpeedScale(speed_scale) {
        this.speed_scale = speed_scale;
    }

    setListenToAll(listenToAll) {
        this.listenToAll = listenToAll;
    };

    /**
     * @param {number} trackIdx - The track this collection listen to 
     * @param {number} speed_scale - The speed scale for initial acceleration
     * @param {boolean} listenToAll - If this collection reacts to all tracks' event
     * @param {()=> number[]} colorGenerator - The default color pattern for the default onNotePlayed / onNoteEnded callback
     * @returns {void}
     * @description Constructor for a general collection, given track index and speed scale, to extend this class,
     * implement constructor, add function and defaultOnNotePlayed callback.
     */
    constructor(trackIdx = 0, speed_scale = 5e-3, listenToAll = false, colorGenerator = (detail) => { return [Math.random() * 55 + 200, Math.random() * 55 + 200, Math.random() * 55 + 200] }) {
        this.collection = [];
        this.trackIdx = trackIdx;
        this.speed_scale = speed_scale;

        this.onNotePlayed = (detail) => {

        };

        this.onNoteEnded = (detail) => {

        };

        this.listenToAll = listenToAll;
        this.colorGenerator = colorGenerator;
    }

    /**
     * @param {Primitive} item - Adding a primitive to the collection
     */
    add(item) {
        this.collection.push(item);
    }

    /**
     * @param {number} idx - Remove an item from the collection by index
     */
    remove(idx) {
        this.collection.splice(idx, 1);
    }

    /**
    * @returns {Primitive []} - Returns the primitive array of this collection
     */
    get() {
        return this.collection;
    }

    /**
    * @returns {Primitive} - Returns a specific primitive by index
     */
    get(idx) {
        return this.collection[idx];
    }

    /**
    * @returns {number} - Returns the size of the primitive array
     */
    getLength() {
        return this.collection.length;
    }

    /**
    * @description Deletes all elements in the primitive array
     */
    clear() {
        this.collection = [];
    }

    forEach(callback) {
        this.collection.forEach(callback);
    }

    map(callback) {
        return this.collection.map(callback);
    }

    filter(callback) {
        return this.collection.filter(callback);
    }

    sort(callback) {
        this.collection.sort(callback);
    }

    /**
     * @description Each item in the collection change its data in one time step,
     * note that the drawing step is not included.
     */
    advance() {
        this.collection.forEach(item => item.advance());
    }

    /**
     * @description  Check if the primitive is out of the screen, by default remove it from the collection if so.
     * This function is overridable, overriding in derived class may gives desired result.
     */
    checkBoundary(p5) {
        this.collection.forEach(item => {
            if (item.checkBoundary(p5)) {
                this.collection.splice(this.collection.indexOf(item), 1);
            }
        });
    }

    /**
     * @description  Draw each element in the collection
     */
    draw(p5) {
        this.collection.forEach(item => item.draw(p5));
    }

    /**
     * @description The aggregated step called on each frame, including `advance`, `checkBoundary` and `draw`.
     * Usually used in p5.draw();
     */
    step(p5) {
        this.advance();
        this.checkBoundary(p5);
        this.draw(p5);
    }

    /**
     * @description Set event listener for note played, only one event listener can be set at a time.
     * This decides how the collection will react to the notes.
     */
    setOnNotePlayed(callback) {
        //remove previous event listener
        document.removeEventListener("notePlayed", (e) => {
            if (e.detail.trackNum === this.trackIdx || this.listenToAll)
                this.onNotePlayed(e.detail);
        });

        this.onNotePlayed = callback;
        //only handle the event when the trackIdx matches or listenToAll is true
        document.addEventListener("notePlayed", (e) => {
            if (e.detail.trackNum === this.trackIdx || this.listenToAll)
                this.onNotePlayed(e.detail);
        });
    }

    /**
     * @description Set event listener for note ended only one event listener can be set at a time.
     * This decides how the collection will react to the notes.
     */
    setOnNoteEnded(callback) {
        //remove previous event listener
        document.removeEventListener("notePlayed", (e) => {
            if (e.detail.trackNum === this.trackIdx || this.listenToAll)
                this.onNoteEnded(e.detail);
        });

        this.onNoteEnded = callback;
        //only handle the event when the trackIdx matches or listenToAll is true
        document.addEventListener("noteEnded", (e) => {
            if (e.detail.trackNum === this.trackIdx || this.listenToAll)
                this.onNoteEnded(e.detail);
        });
    }

    /**
     * @description Set how the color is determined in the default onNotePlayed and onNoteEnded callback.
     * Note that you'll have to specify the color palette 
     * if you are using a custom onNotePlayed / onNoteEnded callback. The colorGenerator only works
     * for default callback.
     */
    setColorGenerator(colorGenerator) {
        this.colorGenerator = colorGenerator;
    }

};

export default Collection;