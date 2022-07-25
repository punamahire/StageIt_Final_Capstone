using Microsoft.AspNetCore.Mvc;
using System;
using StageIt.Models;
using StageIt.Repositories;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace StageIt.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IAppointmentRepository _appointmentRepository;
        public UserProfileController(IUserProfileRepository userProfileRepository, 
                                     IAppointmentRepository appointmentRepository)
        {
            _userProfileRepository = userProfileRepository;
            _appointmentRepository = appointmentRepository;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var userProfile = GetCurrentUserProfile();
            if (userProfile == null || userProfile.RoleId == 1)
            {
                // a client should see list of all stagers irrespective 
                // of whether he is logged in or not
                return Ok(_userProfileRepository.GetAllStagers());
            }
            else if (userProfile.RoleId == 2)
            {
                // a stager should see rest of the stagers
                return Ok(_userProfileRepository.GetAllStagers());
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("{firebaseUserId}")]
        public IActionResult GetUserProfile(string firebaseUserId)
        {
            return Ok(_userProfileRepository.GetByFirebaseUserId(firebaseUserId));
        }

        [HttpGet("DoesUserExist/{firebaseUserId}")]
        public IActionResult DoesUserExist(string firebaseUserId)
        {
            var userProfile = _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
            if (userProfile == null)
            {
                return NotFound();
            }
            return Ok();
        }

        [HttpPost]
        public IActionResult Post(UserProfile userProfile)
        {
            _userProfileRepository.Add(userProfile);
            return CreatedAtAction(
                nameof(GetUserProfile),
                new { firebaseUserId = userProfile.FirebaseUserId },
                userProfile);
        }

        private UserProfile GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
        }
    }
}