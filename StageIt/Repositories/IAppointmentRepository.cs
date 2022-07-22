using StageIt.Models;
using System.Collections.Generic;

namespace StageIt.Repositories
{
    public interface IAppointmentRepository
    {
        List<Appointment> GetAll();
        Appointment GetById(int id);
        void Add(Appointment appointment);
        void Edit(Appointment appointment);
        void Delete(int id);
    }
}
