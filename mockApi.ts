import { User, SystemStats, LogEntry, AdminUser } from './types';
import { faker } from '@faker-js/faker';

export const mockUsers = async (count = 50): Promise<User[]> => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: 1000 + i,
      name: faker.person.fullName(),
      username: faker.internet.userName().toLowerCase(),
      phone: faker.phone.number(),
      isBanned: faker.datatype.boolean(0.1), // 10% chance of being banned
    });
  }
  return users;
};

export const mockAdminUsers = async (): Promise<AdminUser[]> => {
  return [
    { id: 1, username: 'admin', role: 'admin', avatar: faker.image.avatarGitHub(), lastLogin: faker.date.recent().toISOString() },
    { id: 2, username: 'moderator_1', role: 'moderator', avatar: faker.image.avatarGitHub(), lastLogin: faker.date.recent().toISOString() },
  ];
};

export const mockProfile = async (): Promise<AdminUser> => {
    return { id: 1, username: 'admin', role: 'admin', avatar: faker.image.avatarGitHub(), lastLogin: new Date().toISOString() };
}

export const mockSystemStats = async (): Promise<SystemStats> => {
  const ram_total_mb = 8192;
  const storage_total_gb = 512;
  const network_max_mbps = 1000;
  const ram_used_mb = faker.number.int({ min: 2048, max: 7372 });
  const storage_used_gb = faker.number.int({ min: 100, max: 450 });
  const network_speed_mbps = faker.number.int({ min: 50, max: 950 });

  return {
    ram: Math.round((ram_used_mb / ram_total_mb) * 100),
    storage: Math.round((storage_used_gb / storage_total_gb) * 100),
    cpu: faker.number.int({ min: 5, max: 95 }),
    connections: faker.number.int({ min: 100, max: 2500 }),
    ram_used_mb,
    ram_total_mb,
    storage_used_gb,
    storage_total_gb,
    network_speed_mbps,
    network_max_mbps,
    status: faker.datatype.boolean(0.9) ? 'Online' : 'Offline',
    pid: faker.number.int({ min: 1000, max: 99999 }),
  };
};

const logLevels: LogEntry['level'][] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
const logMessages = [
  'User {user} authenticated successfully',
  'Received command: /start from user {user}',
  'API call to {api} took {ms}ms',
  'Database query executed.',
  'Warning: High memory usage detected.',
  'Error: Could not connect to external service.',
  'User {user} sent a message: "{message}"',
  'Broadcasting message to {count} users.',
];

export const mockLogStream = (callback: (log: LogEntry) => void): (() => void) => {
  const intervalId = setInterval(() => {
    const level = faker.helpers.arrayElement(logLevels);
    let message = faker.helpers.arrayElement(logMessages);

    message = message.replace('{user}', faker.internet.userName().toLowerCase());
    message = message.replace('{api}', faker.internet.domainName());
    message = message.replace('{ms}', faker.number.int({ min: 50, max: 500 }).toString());
    message = message.replace('{message}', faker.lorem.sentence());
    message = message.replace('{count}', faker.number.int({min: 100, max: 1000}).toString());

    const log: LogEntry = {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
    };
    callback(log);
  }, faker.number.int({ min: 500, max: 3000 }));

  // Return a function to stop the stream
  return () => clearInterval(intervalId);
};
