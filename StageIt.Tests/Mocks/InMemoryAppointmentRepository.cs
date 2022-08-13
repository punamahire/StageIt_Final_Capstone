using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StageIt.Models;
using StageIt.Repositories;

namespace StageIt.Tests.Mocks
{
    class InMemoryAppointmentRepository : IAppointmentRepository
    {
        private readonly List<Appointment> _data;

        public List<Appointment> InternalData
        {
            get
            {
                return _data;
            }
        }

        public InMemoryAppointmentRepository(List<Appointment> startingData)
        {
            _data = startingData;
        }

        public List<Appointment> GetApptsByUserId(int userId, int roleId)
        {
            return _data.Where(p => p.UserProfileId == userId).ToList();
        }

        public void Add(Appointment appt)
        {
            var lastAppointment = _data.Last();
            appt.Id = lastAppointment.Id + 1;
            _data.Add(appt);
        }

        public void Delete(int id)
        {
            var apptToDelete = _data.FirstOrDefault(p => p.Id == id);
            if (apptToDelete == null)
            {
                return;
            }

            _data.Remove(apptToDelete);
        }

        public Appointment GetById(int id)
        {
            return _data.FirstOrDefault(p => p.Id == id);
        }

        public void Edit(Appointment appt)
        {
            var currentAppointment = _data.FirstOrDefault(p => p.Id == appt.Id);
            if (currentAppointment == null)
            {
                return;
            }

            currentAppointment.AppointmentTime = appt.AppointmentTime;
            currentAppointment.Address = appt.Address;
            currentAppointment.Notes = appt.Notes;
            currentAppointment.Rooms = appt.Rooms;
            currentAppointment.IsFurnished = appt.IsFurnished;
            currentAppointment.Id = appt.Id;
            currentAppointment.UserProfileId = appt.UserProfileId;
            currentAppointment.StagerId = appt.StagerId;
        }

    }
}
