using StageIt.Controllers;
using StageIt.Models;
using StageIt.Tests.Mocks;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace StageIt.Tests
{
    public class AppointmentControllerTests
    {
        [Fact]
        public void GetApptsByUserId_Returns_User_Appointments()
        {
            // Arrange 
            var apptCount = 20;
            var appts = CreateTestAppointments(apptCount);
            // assume the user has 4 appointments
            var testUserProfileId = 10;
            appts[0].UserProfileId = testUserProfileId;
            appts[3].UserProfileId = testUserProfileId;
            appts[9].UserProfileId = testUserProfileId;
            appts[12].UserProfileId = testUserProfileId;
            // add the above appts to expected result
            List<Appointment> expectedAppts = new List<Appointment>();
            expectedAppts.Add(appts[0]);
            expectedAppts.Add(appts[3]);
            expectedAppts.Add(appts[9]);
            expectedAppts.Add(appts[12]);

            var repo = new InMemoryAppointmentRepository(appts);
            var controller = new AppointmentController(repo);

            // Act 
            var result = controller.Get(10, 1); // Test for userId 10; RoleId 1 is client

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var actualAppointments = Assert.IsType<List<Appointment>>(okResult.Value);

            foreach(var actualAppointment in actualAppointments)
            {
                Console.WriteLine(actualAppointment);
            }

            Assert.Equal(expectedAppts.Count, actualAppointments.Count);
            Assert.Equal(expectedAppts, actualAppointments);
        }

        [Fact]
        public void Get_By_Id_Returns_NotFound_When_Given_Unknown_id()
        {
            // Arrange 
            var appts = new List<Appointment>(); // no appts

            var repo = new InMemoryAppointmentRepository(appts);
            var controller = new AppointmentController(repo);

            // Act
            var result = controller.GetById(1);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void Get_By_Id_Returns_Appointment_With_Given_Id()
        {
            // Arrange
            var testAppointmentId = 99;
            var appts = CreateTestAppointments(5);
            appts[0].Id = testAppointmentId; // Make sure we know the Id of one of the appts

            var repo = new InMemoryAppointmentRepository(appts);
            var controller = new AppointmentController(repo);

            // Act
            var result = controller.GetById(testAppointmentId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var actualAppointment = Assert.IsType<Appointment>(okResult.Value);

            Assert.Equal(testAppointmentId, actualAppointment.Id);
        }

        [Fact]
        public void Post_Method_Adds_A_New_Appointment()
        {
            // Arrange 
            var apptCount = 20;
            var appts = CreateTestAppointments(apptCount);

            var repo = new InMemoryAppointmentRepository(appts);
            var controller = new AppointmentController(repo);

            // Act
            var newAppointment = new Appointment()
            {
                AppointmentTime = DateTime.Today,
                Address = "Address",
                Notes = "Test Notes",
                Rooms = 5,
                IsFurnished = true,
                Id = 999,
                UserProfile = CreateTestUserProfile(999),
            };

            controller.Post(newAppointment);

            // Assert
            Assert.Equal(apptCount + 1, repo.InternalData.Count);
        }

        [Fact]
        public void Edit_Method_Returns_BadRequest_When_Ids_Do_Not_Match()
        {
            // Arrange
            var testAppointmentId = 99;
            var appts = CreateTestAppointments(5);
            appts[0].Id = testAppointmentId; // Make sure we know the Id of one of the appts

            var repo = new InMemoryAppointmentRepository(appts);
            var controller = new AppointmentController(repo);

            var apptToUpdate = new Appointment()
            {
                Id = testAppointmentId,
                AppointmentTime = DateTime.Today,
                Address = "Updated Address!",
                Notes = "Test Notes",
                Rooms = 4,
                IsFurnished = true,
                UserProfileId = testAppointmentId,
                StagerId = testAppointmentId + 1
            };
            var someOtherAppointmentId = testAppointmentId + 1; // make sure they aren't the same

            // Act
            var result = controller.Edit(someOtherAppointmentId, apptToUpdate);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public void Edit_Method_Updates_A_Appointment()
        {
            // Arrange
            var testAppointmentId = 99;
            var appts = CreateTestAppointments(5);
            appts[0].Id = testAppointmentId; // Make sure we know the Id of one of the appts

            var repo = new InMemoryAppointmentRepository(appts);
            var controller = new AppointmentController(repo);

            var apptToUpdate = new Appointment()
            {
                Id = testAppointmentId,
                AppointmentTime = DateTime.Today,
                Address = "Updated Address!",
                Notes = "Test Notes",
                Rooms = 4,
                IsFurnished = true,
                UserProfileId = testAppointmentId,
                StagerId = testAppointmentId + 1
            };

            // Act
            controller.Edit(testAppointmentId, apptToUpdate);

            // Assert
            var apptFromDb = repo.InternalData.FirstOrDefault(p => p.Id == testAppointmentId);
            Assert.NotNull(apptFromDb);

            Assert.Equal(apptToUpdate.AppointmentTime, apptFromDb.AppointmentTime);
            Assert.Equal(apptToUpdate.Address, apptFromDb.Address);
            Assert.Equal(apptToUpdate.Id, apptFromDb.Id);
            Assert.Equal(apptToUpdate.Notes, apptFromDb.Notes);
            Assert.Equal(apptToUpdate.Rooms, apptFromDb.Rooms);
            Assert.Equal(apptToUpdate.IsFurnished, apptFromDb.IsFurnished);
        }

        [Fact]
        public void Delete_Method_Removes_A_Appointment()
        {
            // Arrange
            var testAppointmentId = 99;
            var appts = CreateTestAppointments(5);
            appts[0].Id = testAppointmentId; // Make sure we know the Id of one of the appts

            var repo = new InMemoryAppointmentRepository(appts);
            var controller = new AppointmentController(repo);

            // Act
            controller.Delete(testAppointmentId);

            // Assert
            var apptFromDb = repo.InternalData.FirstOrDefault(p => p.Id == testAppointmentId);
            Assert.Null(apptFromDb);
        }

        private List<Appointment> CreateTestAppointments(int count)
        {
            var appts = new List<Appointment>();
            for (var i = 1; i <= count; i++)
            {
                appts.Add(new Appointment()
                {
                    Id = i,
                    Address = $"Address {i}",
                    Notes = $"Notes {i}",
                    Rooms = i,
                    IsFurnished = false,
                    AppointmentTime = DateTime.Today.AddDays(-i),
                    UserProfileId = i,
                    UserProfile = CreateTestUserProfile(i),
                    StagerId = i+1,
                    StagerProfile = CreateTestUserProfile(i+1)
                });
            }
            return appts;
        }

        private UserProfile CreateTestUserProfile(int id)
        {
            return new UserProfile()
            {
                Id = id,
                Name = $"User {id}",
                Email = $"user{id}@example.com",
                ImageUrl = $"http://user.url/{id}",
                LocationsServed = $"location{id}",
                FirebaseUserId = $"FirebaseUserId {id}"
            };
        }
    }
}