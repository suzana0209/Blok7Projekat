namespace WebApp.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DenyMigracija : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AppUsers", "Deny", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AppUsers", "Deny");
        }
    }
}
