'use strict'

var validation = {
    validTitle: function() {
        if(!this.state.eventData.title.trim()) {
            this.state.invalid = 'Please, enter the event title';
            return false;
        };

        this.state.invalid = '';
        return true;
    },

    validCategory: function() {
        if (this.state.eventData.category === '') {
            this.state.invalid = 'Please, select the event category';
            return false;
        };

        this.state.invalid = '';
        return true;
    },

    validDate: function() {
        var start = new Date(this.state.eventData.start_date).getTime() + (+this.state.start_time),
            end = new Date(this.state.eventData.end_date).getTime() + (+this.state.end_time);

        if (start > end) {
            this.state.invalid = 'The begining of the event must be no later then the and of the event';
            return false;
        };

        this.state.invalid = '';
        return true;
    },

    validForm: function() {
        return validation.validTitle.call(this)
               && validation.validCategory.call(this)
               && validation.validDate.call(this);
    }
};


export default validation;
