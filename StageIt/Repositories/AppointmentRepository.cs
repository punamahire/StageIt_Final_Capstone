using Microsoft.Extensions.Configuration;
using StageIt.Models;
using StageIt.Utils;
using System.Collections.Generic;

namespace StageIt.Repositories
{
    public class AppointmentRepository : BaseRepository, IAppointmentRepository
    {
        public AppointmentRepository(IConfiguration configuration) : base(configuration) { }

        public List<Appointment> GetAll()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"SELECT a.Id, a.UserProfileId, a.StagerId, 
                                               a.AppointmentTime, a.Address, a.Notes,
                                               up.Name                                              
                                          FROM Appointment a
                                     LEFT JOIN Userprofile up ON a.UserProfileId = up.Id
                                     ";
                    using (var reader = cmd.ExecuteReader())
                    {
                        var appts = new List<Appointment>();
                        while (reader.Read())
                        {
                            appts.Add(new Appointment()
                            {
                                Id = DbUtils.GetInt(reader, "Id"),
                                UserProfileId = DbUtils.GetInt(reader, "UserProfileId"),
                                StagerId = DbUtils.GetInt(reader, "StagerId"),
                                AppointmentTime = DbUtils.GetDateTime(reader, "AppointmentTime"),
                                Address = DbUtils.GetString(reader, "Address"),
                                Notes = DbUtils.GetString(reader, "Notes"),
                                UserProfile = new UserProfile()
                                {
                                    Id = DbUtils.GetInt(reader, "UserProfileId"),
                                    Name = DbUtils.GetString(reader, "Name")
                                }
                            });
                        }
                        return appts;
                    }
                }
            }
        }
    }
}
