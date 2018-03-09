# FullCalendar
Aspectize extension for the FullCalendar JavaScript event calendar component https://fullcalendar.io/

## 1 - Download

Download extension package from aspectize.com:
- in Aspectize portal, goto extension section
- browse extension, and find FullCalendar
- download package and unzip it into your local WebHost Applications directory; you should have a FullCalendar directory next to your app directory.

## 2 - Configuration

Add FullCalendar as Shared Application in your application configuration file.
In your Visual Studio Project, find the file Application.js in the Configuration folder.

Add FullCalendar in the Directories list :
```javascript
app.Directories = "FullCalendar";
```

## 3 - Include js into your ashx file

In your application.htm.ashx file, add the following lines
```javascript
<script src='https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js'></script>
<script src='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.2/fullcalendar.min.js'></script>
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.2/fullcalendar.min.css' />
<script src='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.8.2/locale-all.js'></script>
```

## 4 - Usage

### Html

In your HTML control definition, add the following control definition:
```html
<div aas-name='MyCalendar' aas-type='FullCalendar.FullCalendar'>
```

### Binding

In your configuration view file
```javascript
vMyViewCalendar.MyCalendar.BindGrid(aas.Data.MainData.MyEvent);

The following properties are bindable:
- EditMode: if true, event can be modified or added with mouse. Default is false.
- Locale: define the moment local (see https://github.com/moment/moment/tree/develop/locale).
- View: define the defaultView of Calendar. Default is month.
- LeftButtons: define the header left buttons. Default is prev,next today.
- CenterButtons: define the header center buttons. Default is title.
- RightButtons: define the header right buttons. Default is month,agendaWeek,agendaDay listMonth.
- WeekEnds: if true, display Saturdays and Sundays. Default is true.
- WeekNumbers: if true, display Week Numbers. Default is true.





