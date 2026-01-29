namespace SimpleWebApp.Models
{
    public class Alarm
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public TimeSpan Time { get; set; }
        public bool IsActive { get; set; }
        public List<string> RepeatDays { get; set; } = new List<string>();
        public string Sound { get; set; } = "default";
    }
}
