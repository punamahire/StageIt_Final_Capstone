using StageIt.Models;
using System.Collections.Generic;

namespace StageIt.Repositories
{
    public interface IUserProfileRepository
    {
        void Add(UserProfile userProfile);
        UserProfile GetByFirebaseUserId(string firebaseUserId);
        List<UserProfile> GetAllStagers();
        List<UserProfile> SearchLocations(string locations);
    }
}