/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisense.js" />
/// <reference path="S:\Delivery\Aspectize.core\AspectizeIntellisenseLibrary.js" />

/* Aspectize FullCalendar extension */

Aspectize.Extend("FullCalendar", {

    Binding: 'GridBinding',

    Properties: { EditMode: false, Locale: 'fr', View: 'month', LeftButtons: 'prev,next today', CenterButtons: 'title', RightButtons: 'month,agendaWeek,agendaDay listMonth', WeekEnds: true, WeekNumbers: false, BusinessHours:'08:30-18:30' },
    Events: ['OnNewEvent', 'OnNeedEvents'],

    Init: function (elem, controlInfo) {

        var fcObj = $(elem);

        elem.style.overflow = 'auto';

        elem.aasEventCells = {};

        var hb = {
            left: Aspectize.UiExtensions.GetProperty(elem, 'LeftButtons'),
            center: Aspectize.UiExtensions.GetProperty(elem, 'CenterButtons'),
            right: Aspectize.UiExtensions.GetProperty(elem, 'RightButtons')
        };

        var editMode = Aspectize.UiExtensions.GetProperty(elem, 'EditMode');

        //function calendarClick(moment) {

        //    // Aspectize.UiExtensions.Notify(elem, 'OnCalendarClick', { Date: moment.local().toDate() });
        //}

        var weekEnds = Aspectize.UiExtensions.GetProperty(elem, 'WeekEnds');
        var businessHours = Aspectize.UiExtensions.GetProperty(elem, 'BusinessHours');

        var bh = false;
        var rxBH = /(\d{2}:\d{2})-(\d{2}:\d{2})/;
        if (rxBH.test(businessHours)) {
            
            var parts = businessHours.split('-');
            bh = {
                dow: weekEnds ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5],
                start: parts[0],
                end: parts[1]
            };
        }

        var fcOptions = {
            defaultView: Aspectize.UiExtensions.GetProperty(elem, 'View'),
            header: hb,
            selectable: editMode,
            editable: editMode,
            startEditable: editMode,
            durationEditable: editMode,

            locale: Aspectize.UiExtensions.GetProperty(elem, 'Locale'),

            nowIndicator: true,
            height: 'parent',

            businessHours: bh,

            weekends: weekEnds,
            weekNumbers: Aspectize.UiExtensions.GetProperty(elem, 'WeekNumbers'),
            weekNumbersWithinDays: true,
            weekNumberCalculation: 'ISO'

        };

        if (fcOptions.selectable) {

            fcOptions.select = function (start, end) {

                var eventData = {
                    title: null,
                    start: start.local().toDate(),
                    end: end.local().toDate()
                };

                Aspectize.UiExtensions.Notify(elem, 'OnNewEvent', eventData);

                fcObj.fullCalendar('unselect');
            }
        }

        if (fcOptions.durationEditable) {

            fcOptions.eventResize = function (evt, delta, revertFunc, jsEvent, ui, view) {

                var eventCell = elem.aasEventCells[evt.id];

                var sstart = evt.start.local().toString();
                var send = evt.end.local().toString();
                var sdelta = delta.toString();

                var end = evt.end.local().toDate();

                var m = evt.start.local().toString() + ' - ';

                m += (evt.end ? evt.end.local().toString() : 'no end') + ' - ';
                m += delta.toString();

                Aspectize.UiExtensions.ChangeProperty(eventCell, 'End', end);
                Aspectize.UiExtensions.Notify(eventCell, 'OnEventChanged', { Event: evt, CancelChange: revertFunc });
            };
        }

        if (fcOptions.startEditable) {

            fcOptions.eventDrop = function (evt, delta, revertFunc, jsEvent, ui, view) {

                var eventCell = elem.aasEventCells[evt.id];

                var start = evt.start.local().toDate();
                Aspectize.UiExtensions.ChangeProperty(eventCell, 'Start', start);

                if (evt.end) {
                    var end = evt.end.local().toDate();

                    Aspectize.UiExtensions.ChangeProperty(eventCell, 'End', end);
                }

                Aspectize.UiExtensions.Notify(eventCell, 'OnEventChanged', { Event: evt, CancelChange: revertFunc });
            };
        }

        fcOptions.eventClick = function (evt, jsEvent, view) {

            var eventCell = elem.aasEventCells[evt.id];
            Aspectize.UiExtensions.SetCurrent(elem, evt.id);

            Aspectize.UiExtensions.Notify(eventCell, 'OnEventClick', { Id: evt.id, Event: evt });
        };

        fcOptions.eventMouseover = function (evt, jsEvent, view) {

            var eventCell = elem.aasEventCells[evt.id];

            Aspectize.UiExtensions.Notify(eventCell, 'OnEventMouseOver', { Id: evt.id, Event: evt });
        };

        fcOptions.viewRender = function (view, element) {

            var arg = { start: view.intervalStart.local().toDate(), end: view.intervalEnd.local().toDate() };

            Aspectize.UiExtensions.Notify(elem, 'OnNeedEvents', arg);
        };

        controlInfo.StartRender = function (control, rowCount) {

        };

        controlInfo.RowRender = function (control, cellControls) {

        };

        controlInfo.EndRender = function (control, rowControls) {

            var oldCells = elem.aasEventCells;
            elem.aasEventCells = {};

            var count = rowControls.length;
            for (var n = 0; n < count; n++) {

                var c = rowControls[n].CellControls[0]; // The cell corresponding to the CalendarEvent ColumnBinding
                var cellInfo = c.aasCell;

                elem.aasEventCells[cellInfo.RowId] = c;
                oldCells[cellInfo.RowId] = null;
                delete oldCells[cellInfo.RowId];

                if (cellInfo.IsNew) {

                    var start = Aspectize.UiExtensions.GetProperty(c, 'Start');
                    var end = Aspectize.UiExtensions.GetProperty(c, 'End');

                    var editable = Aspectize.UiExtensions.GetProperty(c, 'EditMode');

                    var evt = {

                        id: cellInfo.RowId,
                        title: Aspectize.UiExtensions.GetProperty(c, 'Text'),
                        start: moment(start),
                        end: moment(end),
                        allDay: Aspectize.UiExtensions.GetProperty(c, 'AllDay'),

                        editable: editable,
                        startEditable: editable,
                        durationEditable: editable,

                        displayEventTime: Aspectize.UiExtensions.GetProperty(c, 'DisplayStartTime'),
                        displayEventEnd: Aspectize.UiExtensions.GetProperty(c, 'DisplayEndTime'),
                        timeFormat: Aspectize.UiExtensions.GetProperty(c, 'TimeFormat'),

                        className: Aspectize.UiExtensions.GetProperty(c, 'CssClass')
                    };

                    fcObj.fullCalendar('renderEvent', evt, true);
                }
            }

            for (var oldId in oldCells) {
                fcObj.fullCalendar('removeEvents', oldId);
            }
        };

        fcObj.fullCalendar(fcOptions);
    }
});

Aspectize.Extend("CalendarEvent", {

    Binding: 'ColumnBinding',

    Properties: { Text: '', Start: null, End: null, AllDay: false, EditMode: false, CssClass: '', DisplayStartTime: true, DisplayEndTime: true, TimeFormat: 'HH:mm' },
    Events: ['OnPropertyChanged', 'OnEventChanged', 'OnStartChanged', 'OnEndChanged', 'OnEventClick', 'OnEventMouseOver'],

    Map: {
        Text: 'title', Start: 'start', End: 'end', AllDay: 'allDay',
        EditMode: ['editable', 'startEditable', 'durationEditable'],
        DisplayStartTime: 'displayEventTime', DisplayEndTime: 'displayEventEnd',
        TimeFormat: 'timeFormat', CssClass: 'className'
    },

    Init: function (elem, controlInfo) {

        var map = this.Map;
        var eventId = elem.aasCell.RowId;
        var fcObj = $(elem.aasCell.ParentControl);

        Aspectize.UiExtensions.AddMergedPropertyChangeObserver(elem, function (sender, arg) {

            var events = fcObj.fullCalendar('clientEvents', eventId);

            var evt = events[0];

            for (var p in arg) {

                var v = arg[p];
                var f = map[p];

                if (f) {

                    if (f.constructor === Array) {

                        for (var n = 0; n < f.length; n++) {

                            var af = f[n];

                            if (af in evt) {

                                evt[af] = v;
                            }
                        }

                    } else if (f in evt) {

                        if (v.constructor === Date) {

                            evt[f] = moment(v);

                        } else evt[f] = v;
                    }
                }
            }

            fcObj.fullCalendar('updateEvent', evt);
        });
    }
});

