using StageIt.Models;
using System.Collections.Generic;

namespace StageIt.Repositories
{
    public interface IAppointmentRepository
    {
        List<Appointment> GetAll();
    }
}
