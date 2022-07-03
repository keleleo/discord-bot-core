import { Options } from '../models/Options';
import { Client, CommandInteraction } from 'discord.js';
import { onInteractionCreate, onMessageCreate } from './command.controller';

export default function EventController(client: Client, options: Options) {
  client.on('messageCreate', (m) => onMessageCreate(m));
  client.on('interactionCreate', (i: any) =>
    onInteractionCreate(i as CommandInteraction)
  );
}
