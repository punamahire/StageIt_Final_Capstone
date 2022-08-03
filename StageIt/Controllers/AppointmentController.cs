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

        [HttpGet("GetUserAppointments")]
        public IActionResult Get(int id, int roleId)
        {
            // get all the appointments of the user using the user-id.
            // roleId is required to convey DB whether this user is a client 
            // or stager whose appointments we want to query
            return Ok(_appointmentRepository.GetApptsByUserId(id, roleId));
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var appointment = _appointmentRepository.GetById(id);
            if (appointment == null)
            {
                return NotFound();
            }
            return Ok(appointment);
        }

        [HttpPost]
        public IActionResult Post(Appointment appointment)
        {
            _appointmentRepository.Add(appointment);
            return CreatedAtAction("GetById", new { id = appointment.Id }, appointment);
        }

        [HttpPut("{id}")]
        public IActionResult Edit(int id, Appointment appointment)
        {
            if (id != appointment.Id)
            {
                return BadRequest();
            }

            _appointmentRepository.Edit(appointment);
            return NoContent();

        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _appointmentRepository.Delete(id);
            return NoContent();
        }
    }
}
