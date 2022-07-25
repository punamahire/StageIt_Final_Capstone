using Microsoft.Extensions.Configuration;
using StageIt.Models;
using StageIt.Utils;
using System.Collections.Generic;

namespace StageIt.Repositories
{
    public class AppointmentRepository : BaseRepository, IAppointmentRepository
    {
        public AppointmentRepository(IConfiguration configuration) : base(configuration) { }

        public List<Appointment> GetApptsByUserId(int userId, int roleId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    if (roleId == 1)
                    {
                        cmd.CommandText = @"SELECT a.Id, a.UserProfileId, a.StagerId, 
                                               a.AppointmentTime, a.Address, a.Notes,
                                               up.Name AS UserName, stg.Name AS StagerName                                              
                                          FROM Appointment a
                                     LEFT JOIN UserProfile up ON a.UserProfileId = up.Id
                                     LEFT JOIN UserProfile stg ON a.StagerId = stg.Id
                                          WHERE up.Id = @userId
                                     ";
                    }
                    else if (roleId == 2)
                    {
                        cmd.CommandText = @"SELECT a.Id, a.UserProfileId, a.StagerId, 
                                               a.AppointmentTime, a.Address, a.Notes,
                                               up.Name AS UserName, stg.Name AS StagerName                                              
                                          FROM Appointment a
                                     LEFT JOIN UserProfile up ON a.UserProfileId = up.Id
                                     LEFT JOIN UserProfile stg ON a.StagerId = stg.Id
                                          WHERE stg.Id = @userId
                                     ";
                    }
                    else
                    {
                        cmd.CommandText = @"SELECT a.Id, a.UserProfileId, a.StagerId, 
                                               a.AppointmentTime, a.Address, a.Notes,
                                               up.Name AS UserName, stg.Name AS StagerName                                              
                                          FROM Appointment a
                                     LEFT JOIN UserProfile up ON a.UserProfileId = up.Id
                                     LEFT JOIN UserProfile stg ON a.StagerId = stg.Id
                                     ";
                    }

                    DbUtils.AddParameter(cmd, "@userId", userId);

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
                                    Name = DbUtils.GetString(reader, "UserName")
                                },
                                StagerProfile = new UserProfile()
                                {
                                    Id = DbUtils.GetInt(reader, "StagerId"),
                                    Name = DbUtils.GetString(reader, "StagerName")
                                }
                            });
                        }
                        return appts;
                    }
                }
            }
        }

        public Appointment GetById(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"SELECT a.Id, a.UserProfileId, a.StagerId, 
                                               a.AppointmentTime, a.Address, a.Notes,
                                               up.Name as UserName, up.FirebaseUserId,
                                               up.Email, up.ImageUrl,
                                               upr.RoleId 
                                          FROM Appointment a
                                     LEFT JOIN Userprofile up ON a.UserProfileId = up.Id
                                     LEFT JOIN UserProfileRole upr ON upr.UserProfileId = a.UserProfileId
                                         WHERE a.Id = @id";

                    DbUtils.AddParameter(cmd, "@id", id);
                    var reader = cmd.ExecuteReader();
                    Appointment appointment = null;
                    if (reader.Read())
                    {
                        appointment = new Appointment()
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
                                FirebaseUserId = DbUtils.GetString(reader, "FirebaseUserId"),
                                Name = DbUtils.GetString(reader, "UserName"),
                                Email = DbUtils.GetString(reader, "Email"),
                                ImageUrl = DbUtils.GetString(reader, "ImageUrl"),
                                RoleId = DbUtils.GetInt(reader, "RoleId")
                            }
                        };
                    }
                    return appointment;
                }
            }
        }


        public void Add(Appointment appointment)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"INSERT INTO Appointment (UserProfileId, StagerId,  
                                                         AppointmentTime, Address, Notes)
                                        OUTPUT INSERTED.ID
                                        VALUES (@UserProfileId, @StagerId,  
                                                @AppointmentTime, @Address, @Notes)";
                    DbUtils.AddParameter(cmd, "@UserProfileId", appointment.UserProfileId);
                    DbUtils.AddParameter(cmd, "@StagerId", appointment.StagerId);
                    DbUtils.AddParameter(cmd, "@AppointmentTime", appointment.AppointmentTime);
                    DbUtils.AddParameter(cmd, "@Address", appointment.Address);
                    DbUtils.AddParameter(cmd, "@Notes", appointment.Notes);

                    appointment.Id = (int)cmd.ExecuteScalar();
                }
            }
        }

        public void Edit(Appointment appointment)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"UPDATE Appointment
                                        SET   UserProfileId = @UserProfileId, 
                                              StagerId = @StagerId, 
                                              AppointmentTime = @AppointmentTime,
                                              Address = @Address, 
                                              Notes = @Notes
                                        WHERE Id = @Id";
                    DbUtils.AddParameter(cmd, "@UserProfileId", appointment.UserProfileId);
                    DbUtils.AddParameter(cmd, "@StagerId", appointment.StagerId);
                    DbUtils.AddParameter(cmd, "@AppointmentTime", appointment.AppointmentTime);
                    DbUtils.AddParameter(cmd, "@Address", appointment.Address);
                    DbUtils.AddParameter(cmd, "@Notes", appointment.Notes);
                    DbUtils.AddParameter(cmd, "@Id", appointment.Id);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void Delete(int id)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = "DELETE FROM Appointment WHERE @id = id";
                    DbUtils.AddParameter(cmd, "@id", id);

                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
