using StageIt.Models;
using System.Collections.Generic;

namespace StageIt.Repositories
{
    public interface IUserProfileRepository
    {
        void Add(UserProfile userProfile);
        UserProfile GetByFirebaseUserId(string firebaseUserId);
        List<UserProfile> GetAllStagers();
        UserProfile GetById(int id);
        List<UserProfile> SearchLocations(string locations);
    }
}