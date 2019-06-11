using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using Aspectize.Core;

namespace Calendar {
    public interface ICalendarEvents {

        Dictionary<string, object> GetEvents(DateTime start, DateTime end);
    }

    [Service(Name = "CalendarEvents")]
    public class CalendarEvents : ICalendarEvents //, IInitializable, ISingleton
    {
        Dictionary<string, object> ICalendarEvents.GetEvents(DateTime start, DateTime end) {
            throw new NotImplementedException();
        }
    }

}
