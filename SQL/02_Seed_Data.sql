SET IDENTITY_INSERT [dbo].[Role] ON
INSERT INTO [dbo].[Role] ([Id], [Name]) VALUES (1, N'Client')
INSERT INTO [dbo].[Role] ([Id], [Name]) VALUES (2, N'Stager')
SET IDENTITY_INSERT [dbo].[Role] OFF

SET IDENTITY_INSERT [dbo].[UserProfile] ON
INSERT INTO [dbo].[UserProfile] ([Id], [FirebaseUserId], [Name], [Email], [ImageUrl], [LocationsServed]) VALUES (3, N'jJ2sat00y7Nsmt3gJggoji2NfSw1', N'Chirag', N'chirag@gmail.com', NULL, NULL)
INSERT INTO [dbo].[UserProfile] ([Id], [FirebaseUserId], [Name], [Email], [ImageUrl], [LocationsServed]) VALUES (4, N'rh4KhuKYpjTR8vmspr89LEiOK1h1', N'Jason', N'jason@gmail.com', NULL, 'Nashville,Franklin,Brentwood')
SET IDENTITY_INSERT [dbo].[UserProfile] OFF

SET IDENTITY_INSERT [dbo].[UserProfileRole] ON
INSERT INTO [dbo].[UserProfileRole] ([Id], [UserProfileId], [RoleId]) VALUES (1, 3, 1)
INSERT INTO [dbo].[UserProfileRole] ([Id], [UserProfileId], [RoleId]) VALUES (2, 4, 2)
SET IDENTITY_INSERT [dbo].[UserProfileRole] OFF
