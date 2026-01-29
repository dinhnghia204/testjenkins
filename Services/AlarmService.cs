using SimpleWebApp.Models;

namespace SimpleWebApp.Services
{
    public class AlarmService
    {
        private readonly List<Alarm> _alarms = new List<Alarm>();
        private int _nextId = 1;

        public List<Alarm> GetAll()
        {
            return _alarms.OrderBy(a => a.Time).ToList();
        }

        public Alarm? GetById(int id)
        {
            return _alarms.FirstOrDefault(a => a.Id == id);
        }

        public Alarm Create(Alarm alarm)
        {
            alarm.Id = _nextId++;
            _alarms.Add(alarm);
            return alarm;
        }

        public Alarm? Update(int id, Alarm updatedAlarm)
        {
            var alarm = GetById(id);
            if (alarm == null) return null;

            alarm.Name = updatedAlarm.Name;
            alarm.Time = updatedAlarm.Time;
            alarm.IsActive = updatedAlarm.IsActive;
            alarm.RepeatDays = updatedAlarm.RepeatDays;
            alarm.Sound = updatedAlarm.Sound;
            return alarm;
        }

        public bool Delete(int id)
        {
            var alarm = GetById(id);
            if (alarm == null) return false;

            _alarms.Remove(alarm);
            return true;
        }

        public List<Alarm> GetActiveAlarms()
        {
            return _alarms.Where(a => a.IsActive).ToList();
        }
    }
}
