const { db, userQueries, roleQueries, userRoleQueries, taskQueries, hashPassword } = require('../src/models/database');

async function seedData() {
  console.log('🌱 Seeding demo data...');

  try {
    // Create roles
    console.log('Creating roles...');
    const roles = [
      { name: 'Administrator', description: 'Full system access and user management' },
      { name: 'Sales Manager', description: 'Manage sales team and view team tasks' },
      { name: 'Sales User', description: 'Create and manage own sales tasks' },
      { name: 'Reporting User', description: 'Read-only access to reports and dashboards' }
    ];

    const roleIds = {};
    for (const role of roles) {
      try {
        const result = roleQueries.create.run(role.name, role.description);
        roleIds[role.name] = result.lastInsertRowid;
      } catch (error) {
        // Role might already exist
        const existing = roleQueries.findByName.get(role.name);
        if (existing) {
          roleIds[role.name] = existing.id;
        }
      }
    }

    // Create users
    console.log('Creating users...');
    const defaultPassword = await hashPassword('admin123');
    
    const users = [
      // Administrator
      {
        username: 'admin',
        password: defaultPassword,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@saviyntdemo.com',
        manager_id: null,
        department: 'IT',
        location: 'San Francisco',
        status: 'active',
        roles: ['Administrator']
      },
      // Sales Managers
      {
        username: 'jsmith',
        password: defaultPassword,
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@saviyntdemo.com',
        manager_id: null,
        department: 'Sales',
        location: 'New York',
        status: 'active',
        roles: ['Sales Manager']
      },
      {
        username: 'sjohnson',
        password: defaultPassword,
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@saviyntdemo.com',
        manager_id: null,
        department: 'Sales',
        location: 'Chicago',
        status: 'active',
        roles: ['Sales Manager']
      },
      // Sales Users
      {
        username: 'mwilliams',
        password: defaultPassword,
        first_name: 'Michael',
        last_name: 'Williams',
        email: 'michael.williams@saviyntdemo.com',
        manager_id: 2, // John Smith
        department: 'Sales',
        location: 'New York',
        status: 'active',
        roles: ['Sales User']
      },
      {
        username: 'ebrown',
        password: defaultPassword,
        first_name: 'Emily',
        last_name: 'Brown',
        email: 'emily.brown@saviyntdemo.com',
        manager_id: 2, // John Smith
        department: 'Sales',
        location: 'New York',
        status: 'active',
        roles: ['Sales User']
      },
      {
        username: 'djones',
        password: defaultPassword,
        first_name: 'David',
        last_name: 'Jones',
        email: 'david.jones@saviyntdemo.com',
        manager_id: 3, // Sarah Johnson
        department: 'Sales',
        location: 'Chicago',
        status: 'active',
        roles: ['Sales User']
      },
      {
        username: 'lgarcia',
        password: defaultPassword,
        first_name: 'Lisa',
        last_name: 'Garcia',
        email: 'lisa.garcia@saviyntdemo.com',
        manager_id: 3, // Sarah Johnson
        department: 'Sales',
        location: 'Chicago',
        status: 'active',
        roles: ['Sales User']
      },
      // Reporting User
      {
        username: 'rmartinez',
        password: defaultPassword,
        first_name: 'Robert',
        last_name: 'Martinez',
        email: 'robert.martinez@saviyntdemo.com',
        manager_id: 1, // Admin
        department: 'Analytics',
        location: 'San Francisco',
        status: 'active',
        roles: ['Reporting User']
      }
    ];

    const userIds = [];
    for (const user of users) {
      try {
        const result = userQueries.create.run(
          user.username,
          user.password,
          user.first_name,
          user.last_name,
          user.email,
          user.manager_id,
          user.department,
          user.location,
          user.status
        );
        
        const userId = result.lastInsertRowid;
        userIds.push(userId);

        // Assign roles
        for (const roleName of user.roles) {
          if (roleIds[roleName]) {
            userRoleQueries.assign.run(userId, roleIds[roleName]);
          }
        }
      } catch (error) {
        console.error(`Error creating user ${user.username}:`, error.message);
      }
    }

    // Create sample tasks
    console.log('Creating sample tasks...');
    const tasks = [
      {
        title: 'Follow up with Acme Corp',
        description: 'Schedule a follow-up call to discuss the Q2 proposal',
        type: 'Follow-up',
        status: 'open',
        priority: 'high',
        assigned_to: 4, // Michael Williams
        created_by: 2, // John Smith
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Prepare Q1 sales report',
        description: 'Compile all Q1 sales data and prepare presentation for management',
        type: 'Reporting',
        status: 'in_progress',
        priority: 'high',
        assigned_to: 5, // Emily Brown
        created_by: 2, // John Smith
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Cold call new prospects',
        description: 'Reach out to 20 new prospects from the marketing qualified leads list',
        type: 'Prospecting',
        status: 'open',
        priority: 'medium',
        assigned_to: 4, // Michael Williams
        created_by: 4,
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Update CRM records',
        description: 'Update contact information for all accounts in the Chicago region',
        type: 'Administrative',
        status: 'in_progress',
        priority: 'low',
        assigned_to: 6, // David Jones
        created_by: 3, // Sarah Johnson
        due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Demo for TechStart Inc',
        description: 'Conduct product demo for TechStart Inc stakeholders',
        type: 'Demo',
        status: 'completed',
        priority: 'high',
        assigned_to: 7, // Lisa Garcia
        created_by: 3, // Sarah Johnson
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Negotiate contract terms',
        description: 'Work with legal to finalize contract terms for Global Systems deal',
        type: 'Negotiation',
        status: 'in_progress',
        priority: 'high',
        assigned_to: 5, // Emily Brown
        created_by: 2, // John Smith
        due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Attend sales training',
        description: 'Complete the new product features training module',
        type: 'Training',
        status: 'open',
        priority: 'medium',
        assigned_to: 6, // David Jones
        created_by: 3, // Sarah Johnson
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Client visit preparation',
        description: 'Prepare materials and agenda for on-site client visit next week',
        type: 'Meeting Prep',
        status: 'open',
        priority: 'high',
        assigned_to: 7, // Lisa Garcia
        created_by: 7,
        due_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Renewal discussion',
        description: 'Contact Beta Solutions about their annual contract renewal',
        type: 'Renewal',
        status: 'open',
        priority: 'medium',
        assigned_to: 4, // Michael Williams
        created_by: 2, // John Smith
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Territory analysis',
        description: 'Analyze sales performance across all territories for strategy meeting',
        type: 'Analysis',
        status: 'completed',
        priority: 'medium',
        assigned_to: 3, // Sarah Johnson
        created_by: 1, // Admin
        due_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Lead qualification',
        description: 'Qualify and score the new leads from last weeks webinar',
        type: 'Prospecting',
        status: 'in_progress',
        priority: 'medium',
        assigned_to: 6, // David Jones
        created_by: 6,
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Competitor research',
        description: 'Research new competitor offerings and update competitive analysis',
        type: 'Research',
        status: 'open',
        priority: 'low',
        assigned_to: 5, // Emily Brown
        created_by: 2, // John Smith
        due_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Customer feedback review',
        description: 'Review customer feedback from Q4 and identify improvement areas',
        type: 'Review',
        status: 'completed',
        priority: 'medium',
        assigned_to: 7, // Lisa Garcia
        created_by: 3, // Sarah Johnson
        due_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Pipeline review meeting',
        description: 'Prepare for monthly pipeline review with sales leadership',
        type: 'Meeting Prep',
        status: 'open',
        priority: 'high',
        assigned_to: 2, // John Smith
        created_by: 1, // Admin
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        title: 'Sales enablement materials',
        description: 'Create new sales enablement materials for product launch',
        type: 'Content Creation',
        status: 'in_progress',
        priority: 'medium',
        assigned_to: 4, // Michael Williams
        created_by: 2, // John Smith
        due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];

    for (const task of tasks) {
      try {
        taskQueries.create.run(
          task.title,
          task.description,
          task.type,
          task.status,
          task.priority,
          task.assigned_to,
          task.created_by,
          task.due_date
        );
      } catch (error) {
        console.error(`Error creating task:`, error.message);
      }
    }

    console.log('✅ Demo data seeded successfully');
    console.log('\n📝 Demo Login Credentials:');
    console.log('   Administrator: admin / admin123');
    console.log('   Sales Manager: jsmith / admin123');
    console.log('   Sales User: mwilliams / admin123');
    console.log('   Reporting User: rmartinez / admin123\n');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedData()
    .then(() => {
      db.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      db.close();
      process.exit(1);
    });
}

module.exports = seedData;
