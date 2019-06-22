namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NovaMigracija1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Addresses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        City = c.String(),
                        Street = c.String(),
                        Number = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.AppUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        LastName = c.String(),
                        Email = c.String(),
                        Activated = c.Boolean(nullable: false),
                        Image = c.String(),
                        PassangerTypeId = c.Int(),
                        UserTypeId = c.Int(),
                        AddressId = c.Int(),
                        Birthaday = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Addresses", t => t.AddressId)
                .ForeignKey("dbo.PassangerTypes", t => t.PassangerTypeId)
                .ForeignKey("dbo.UserTypes", t => t.UserTypeId)
                .Index(t => t.PassangerTypeId)
                .Index(t => t.UserTypeId)
                .Index(t => t.AddressId);
            
            CreateTable(
                "dbo.PassangerTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        RoleCoefficient = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.UserTypes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Days",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Timetables",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        DayId = c.Int(nullable: false),
                        LineId = c.Int(nullable: false),
                        Departures = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Days", t => t.DayId, cascadeDelete: true)
                .ForeignKey("dbo.Lines", t => t.LineId, cascadeDelete: true)
                .Index(t => t.DayId)
                .Index(t => t.LineId);
            
            CreateTable(
                "dbo.Lines",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RegularNumber = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.LineStations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrdinalNumber = c.Int(nullable: false),
                        StationId = c.Int(nullable: false),
                        LineId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Lines", t => t.LineId, cascadeDelete: true)
                .ForeignKey("dbo.Stations", t => t.StationId, cascadeDelete: true)
                .Index(t => t.StationId)
                .Index(t => t.LineId);
            
            CreateTable(
                "dbo.Stations",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        AddressStation = c.String(),
                        Longitude = c.Double(nullable: false),
                        Latitude = c.Double(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Vehicles",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        RegistrationNumber = c.String(nullable: false),
                        Longitude = c.Double(nullable: false),
                        Latitude = c.Double(nullable: false),
                        LineId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Lines", t => t.LineId, cascadeDelete: true)
                .Index(t => t.LineId);
            
            CreateTable(
                "dbo.PriceLists",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FromTime = c.DateTime(),
                        ToTime = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.TicketPrices",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Price = c.Double(nullable: false),
                        PriceListId = c.Int(nullable: false),
                        TypeOfTicketId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.PriceLists", t => t.PriceListId, cascadeDelete: true)
                .ForeignKey("dbo.TypeOfTickets", t => t.TypeOfTicketId, cascadeDelete: true)
                .Index(t => t.PriceListId)
                .Index(t => t.TypeOfTicketId);
            
            CreateTable(
                "dbo.TypeOfTickets",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Tickets",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Valid = c.Boolean(nullable: false),
                        AppUserId = c.String(maxLength: 128),
                        TicketPriceId = c.Int(nullable: false),
                        PriceOfTicket = c.Double(nullable: false),
                        TypeOfTicket_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AppUsers", t => t.AppUserId)
                .ForeignKey("dbo.TicketPrices", t => t.TicketPriceId, cascadeDelete: true)
                .ForeignKey("dbo.TypeOfTickets", t => t.TypeOfTicket_Id)
                .Index(t => t.AppUserId)
                .Index(t => t.TicketPriceId)
                .Index(t => t.TypeOfTicket_Id);
            
            CreateTable(
                "dbo.StationLines",
                c => new
                    {
                        Station_Id = c.Int(nullable: false),
                        Line_Id = c.Int(nullable: false),
                    })
                .PrimaryKey(t => new { t.Station_Id, t.Line_Id })
                .ForeignKey("dbo.Stations", t => t.Station_Id, cascadeDelete: true)
                .ForeignKey("dbo.Lines", t => t.Line_Id, cascadeDelete: true)
                .Index(t => t.Station_Id)
                .Index(t => t.Line_Id);
            
            AddColumn("dbo.AspNetUsers", "AppUserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.AspNetUsers", "AppUserId");
            AddForeignKey("dbo.AspNetUsers", "AppUserId", "dbo.AppUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUsers", "AppUserId", "dbo.AppUsers");
            DropForeignKey("dbo.Tickets", "TypeOfTicket_Id", "dbo.TypeOfTickets");
            DropForeignKey("dbo.Tickets", "TicketPriceId", "dbo.TicketPrices");
            DropForeignKey("dbo.Tickets", "AppUserId", "dbo.AppUsers");
            DropForeignKey("dbo.TicketPrices", "TypeOfTicketId", "dbo.TypeOfTickets");
            DropForeignKey("dbo.TicketPrices", "PriceListId", "dbo.PriceLists");
            DropForeignKey("dbo.Timetables", "LineId", "dbo.Lines");
            DropForeignKey("dbo.Vehicles", "LineId", "dbo.Lines");
            DropForeignKey("dbo.LineStations", "StationId", "dbo.Stations");
            DropForeignKey("dbo.StationLines", "Line_Id", "dbo.Lines");
            DropForeignKey("dbo.StationLines", "Station_Id", "dbo.Stations");
            DropForeignKey("dbo.LineStations", "LineId", "dbo.Lines");
            DropForeignKey("dbo.Timetables", "DayId", "dbo.Days");
            DropForeignKey("dbo.AppUsers", "UserTypeId", "dbo.UserTypes");
            DropForeignKey("dbo.AppUsers", "PassangerTypeId", "dbo.PassangerTypes");
            DropForeignKey("dbo.AppUsers", "AddressId", "dbo.Addresses");
            DropIndex("dbo.StationLines", new[] { "Line_Id" });
            DropIndex("dbo.StationLines", new[] { "Station_Id" });
            DropIndex("dbo.AspNetUsers", new[] { "AppUserId" });
            DropIndex("dbo.Tickets", new[] { "TypeOfTicket_Id" });
            DropIndex("dbo.Tickets", new[] { "TicketPriceId" });
            DropIndex("dbo.Tickets", new[] { "AppUserId" });
            DropIndex("dbo.TicketPrices", new[] { "TypeOfTicketId" });
            DropIndex("dbo.TicketPrices", new[] { "PriceListId" });
            DropIndex("dbo.Vehicles", new[] { "LineId" });
            DropIndex("dbo.LineStations", new[] { "LineId" });
            DropIndex("dbo.LineStations", new[] { "StationId" });
            DropIndex("dbo.Timetables", new[] { "LineId" });
            DropIndex("dbo.Timetables", new[] { "DayId" });
            DropIndex("dbo.AppUsers", new[] { "AddressId" });
            DropIndex("dbo.AppUsers", new[] { "UserTypeId" });
            DropIndex("dbo.AppUsers", new[] { "PassangerTypeId" });
            DropColumn("dbo.AspNetUsers", "AppUserId");
            DropTable("dbo.StationLines");
            DropTable("dbo.Tickets");
            DropTable("dbo.TypeOfTickets");
            DropTable("dbo.TicketPrices");
            DropTable("dbo.PriceLists");
            DropTable("dbo.Vehicles");
            DropTable("dbo.Stations");
            DropTable("dbo.LineStations");
            DropTable("dbo.Lines");
            DropTable("dbo.Timetables");
            DropTable("dbo.Days");
            DropTable("dbo.UserTypes");
            DropTable("dbo.PassangerTypes");
            DropTable("dbo.AppUsers");
            DropTable("dbo.Addresses");
        }
    }
}
