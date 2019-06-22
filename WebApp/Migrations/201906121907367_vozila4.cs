namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class vozila4 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Vehicles", "LineId", c => c.Int(nullable: false));
            CreateIndex("dbo.Vehicles", "LineId");
            AddForeignKey("dbo.Vehicles", "LineId", "dbo.Lines", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Vehicles", "LineId", "dbo.Lines");
            DropIndex("dbo.Vehicles", new[] { "LineId" });
            DropColumn("dbo.Vehicles", "LineId");
        }
    }
}
