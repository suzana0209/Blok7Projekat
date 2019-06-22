namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class VersionMigracija : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Timetables", "Version", c => c.Int(nullable: false));
            AddColumn("dbo.Lines", "Version", c => c.Int(nullable: false));
            AddColumn("dbo.Stations", "Version", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stations", "Version");
            DropColumn("dbo.Lines", "Version");
            DropColumn("dbo.Timetables", "Version");
        }
    }
}
