IF db_id('StageIt') IS NULl
  CREATE DATABASE [StageIt]
GO

USE [StageIt]
GO


DROP TABLE IF EXISTS [UserProfileRole];
DROP TABLE IF EXISTS [Appointment];
DROP TABLE IF EXISTS [Role];
DROP TABLE IF EXISTS [UserProfile];
GO

CREATE TABLE [UserProfile] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [FirebaseUserId] nvarchar(50) NOT NULL,
  [Name] nvarchar(255) NOT NULL,
  [Email] nvarchar(255) NOT NULL,
  [ImageUrl] nvarchar(255),
  [LocationsServed] nvarchar(255) DEFAULT NULL
)
GO

CREATE TABLE [UserProfileRole] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [UserProfileId] int NOT NULL,
  [RoleId] int NOT NULL
)
GO

CREATE TABLE [Role] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [Name] nvarchar(255) NOT NULL
)
GO

CREATE TABLE [Appointment] (
  [Id] int PRIMARY KEY IDENTITY(1, 1),
  [UserProfileId] int NOT NULL,
  [StagerId] int NOT NULL,
  [AppointmentTime] datetime NOT NULL,
  [Address] nvarchar(255) NOT NULL,
  [IsFurnished] bit DEFAULT 0 NOT NULL,
  [Rooms] int DEFAULT 0,
  [Notes] nvarchar(255)
)
GO

ALTER TABLE [UserProfileRole] ADD FOREIGN KEY ([RoleId]) REFERENCES [Role] ([Id])
GO

ALTER TABLE [UserProfileRole] ADD FOREIGN KEY ([UserProfileId]) REFERENCES [UserProfile] ([Id])
GO

ALTER TABLE [Appointment] ADD FOREIGN KEY ([UserProfileId]) REFERENCES [UserProfile] ([Id])
GO

ALTER TABLE [Appointment] ADD FOREIGN KEY ([StagerId]) REFERENCES [UserProfile] ([Id])
GO
