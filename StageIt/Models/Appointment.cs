using System;
using System.ComponentModel.DataAnnotations;

namespace StageIt.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public int UserProfileId { get; set; }
        public int StagerId { get; set; }

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime AppointmentTime { get; set; }

        [Required]
        [MaxLength(255)]
        public string Address { get; set; }
        public string Notes { get; set; }
        public Boolean IsFurnished { get; set; }
        public int Rooms { get; set; }

        public UserProfile UserProfile { get; set; }
        public UserProfile StagerProfile { get; set; }
    }
}
