﻿using Microsoft.AspNetCore.Mvc;
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
            if (userProfile.RoleId == 1 || userProfile.RoleId == 2)
            {
                // client or stager can view all stagers
                return Ok(_userProfileRepository.GetAllStagers());
            }
            else
            {
                // if the user is not logged in he doesn't get to 
                // view or book appointment with stagers
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

        [HttpGet("GetUserById")]
        public IActionResult GetById(int id)
        {
            var userProfile = _userProfileRepository.GetById(id);
            if (userProfile == null)
            {
                return NotFound();
            }
            return Ok(userProfile);
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

        [HttpGet("search")]
        public IActionResult Search(string q)
        {
            return Ok(_userProfileRepository.SearchLocations(q));
        }

        private UserProfile GetCurrentUserProfile()
        {
            var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            return _userProfileRepository.GetByFirebaseUserId(firebaseUserId);
        }
    }
}