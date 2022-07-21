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
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentRepository _appointmentRepository;
        public AppointmentController(IAppointmentRepository appointmentRepository)
        {
            _appointmentRepository = appointmentRepository;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_appointmentRepository.GetAll());
        }
    }
}
