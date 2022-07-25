using Microsoft.Extensions.Configuration;
using StageIt.Models;
using StageIt.Utils;
using System.Collections.Generic;

namespace StageIt.Repositories
{
    public class UserProfileRepository : BaseRepository, IUserProfileRepository
    {
        public UserProfileRepository(IConfiguration configuration) : base(configuration) { }

        public UserProfile GetByFirebaseUserId(string firebaseUserId)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                        SELECT up.Id, up.FirebaseUserId, up.Name, 
                               up.Email, up.ImageUrl,
                               up.LocationsServed,
                               upr.RoleId
                          FROM UserProfile up
                            LEFT JOIN UserProfileRole upr ON upr.UserProfileId = up.Id
                         WHERE up.FirebaseUserId = @FirebaseuserId";

                    DbUtils.AddParameter(cmd, "@FirebaseUserId", firebaseUserId);

                    UserProfile userProfile = null;

                    var reader = cmd.ExecuteReader();
                    if (reader.Read())
                    {
                        userProfile = new UserProfile()
                        {
                            Id = DbUtils.GetInt(reader, "Id"),
                            FirebaseUserId = DbUtils.GetString(reader, "FirebaseUserId"),
                            Name = DbUtils.GetString(reader, "Name"),
                            Email = DbUtils.GetString(reader, "Email"),
                            ImageUrl = DbUtils.GetString(reader, "ImageUrl"),
                            LocationsServed = DbUtils.GetString(reader, "LocationsServed"),
                            RoleId = DbUtils.GetInt(reader, "RoleId")
                        };
                    }
                    reader.Close();

                    return userProfile;
                }
            }
        }

        public void Add(UserProfile userProfile)
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"INSERT INTO UserProfile (FirebaseUserId, Name,  
                                                                 Email, ImageUrl,
                                                                 LocationsServed)
                                        OUTPUT INSERTED.ID
                                        VALUES (@FirebaseUserId, @Name,  
                                                @Email, @ImageUrl, @LocationsServed)";
                    DbUtils.AddParameter(cmd, "@FirebaseUserId", userProfile.FirebaseUserId);
                    DbUtils.AddParameter(cmd, "@Name", userProfile.Name);
                    DbUtils.AddParameter(cmd, "@Email", userProfile.Email);
                    DbUtils.AddParameter(cmd, "@ImageUrl", userProfile.ImageUrl);
                    DbUtils.AddParameter(cmd, "@LocationsServed", userProfile.LocationsServed);

                    userProfile.Id = (int)cmd.ExecuteScalar();
                }

                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"INSERT INTO UserProfileRole (UserProfileId, RoleId)  
                                        OUTPUT INSERTED.ID
                                        VALUES (@UserProfileId, @RoleId)";
                    DbUtils.AddParameter(cmd, "@UserProfileId", userProfile.Id);
                    DbUtils.AddParameter(cmd, "@RoleId", userProfile.RoleId);

                    cmd.ExecuteNonQuery();
                }
            }
        }

        public List<UserProfile> GetAllStagers()
        {
            using (var conn = Connection)
            {
                conn.Open();
                using (var cmd = conn.CreateCommand())
                {
                    cmd.CommandText = @"
                 SELECT up.Id, up.FirebaseUserId, up.Name, up.Email, 
                      up.ImageUrl AS UserProfileImageUrl,
                      up.LocationsServed
                 FROM Userprofile up 
                    LEFT JOIN UserProfileRole upr ON upr.UserProfileId = up.Id
                 WHERE upr.RoleId = 2
                 ";

                    using (var reader = cmd.ExecuteReader())
                    {
                        var stagers = new List<UserProfile>();
                        while (reader.Read())
                        {
                            stagers.Add(new UserProfile()
                            {
                                Id = DbUtils.GetInt(reader, "Id"),
                                FirebaseUserId = DbUtils.GetString(reader, "FirebaseUserId"),
                                Name = DbUtils.GetString(reader, "Name"),
                                Email = DbUtils.GetString(reader, "Email"),
                                ImageUrl = DbUtils.GetString(reader, "UserProfileImageUrl"),
                                LocationsServed = DbUtils.GetString(reader, "LocationsServed")
                            });
                        }

                        return stagers;
                    }
                }
            }
        }

        /*
        public UserProfile GetByFirebaseUserId(string firebaseUserId)
        {
            return _context.UserProfile
                       .Include(up => up.UserType) 
                       .FirstOrDefault(up => up.FirebaseUserId == firebaseUserId);
        }
        public void Add(UserProfile userProfile)
        {
            _context.Add(userProfile);
            _context.SaveChanges();
        }
        */
    }
}