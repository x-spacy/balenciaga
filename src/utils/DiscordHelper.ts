import {
  ButtonInteraction,
  Message,
  MessageCreateOptions,
  MessagePayload,
  TextChannel,
  UserSelectMenuInteraction
} from 'discord.js';

declare module 'discord.js' {
  interface Message {
    sendTemporaryMessage(temporaryMessage: string | MessagePayload | MessageCreateOptions, duration?: number): Promise<Message<boolean>>;

    replyTemporaryMessage(temporaryMessage: string | MessagePayload | MessageCreateOptions, duration?: number): Promise<Message<boolean>>;
  }

  interface TextChannel {
    sendTemporaryMessage(temporaryMessage: string | MessagePayload | MessageCreateOptions, duration?: number): Promise<Message<boolean>>;
  }

  interface UserSelectMenuInteraction {
    replyTemporaryMessage(temporaryMessage: string | MessagePayload | MessageCreateOptions, duration?: number): Promise<Message<boolean>>;
  }

  interface ButtonInteraction {
    replyTemporaryMessage(temporaryMessage: string | MessagePayload | MessageCreateOptions, duration?: number): Promise<Message<boolean>>;
  }
}

Message.prototype.sendTemporaryMessage = async function (this: Message, temporaryMessage: string | MessagePayload | MessageCreateOptions, duration: number = 5_000) {
  const textChannel = this.channel as TextChannel;

  const message = await textChannel.send(temporaryMessage);

  setTimeout(async () => {
    await Promise.all([
      this.delete(),
      message.delete()
    ]);

  }, duration);

  return message;
};

Message.prototype.replyTemporaryMessage = async function (this: Message, temporaryMessage: string | MessagePayload | MessageCreateOptions, duration: number = 5_000) {
  const replyMessage = await this.reply(temporaryMessage);

  setTimeout(async () => {
    await Promise.all([
      this.delete(),
      replyMessage.delete()
    ]);
  }, duration);

  return replyMessage;
};

TextChannel.prototype.sendTemporaryMessage = async function (this: TextChannel, temporaryMessage: string | MessagePayload | MessageCreateOptions, duration: number = 5_000) {
  const message = await this.send(temporaryMessage);

  setTimeout(async () => message.delete(), duration);

  return message;
};

UserSelectMenuInteraction.prototype.replyTemporaryMessage = async function (this: UserSelectMenuInteraction, temporaryMessage: string | MessagePayload | MessageCreateOptions, duration: number = 5_000) {
  const textChannel = this.message.channel as TextChannel;

  const replyMessage = await textChannel.send(temporaryMessage);

  setTimeout(async () => {
    await Promise.all([
      this.message.delete(),
      replyMessage.delete()
    ]);
  }, duration);

  return replyMessage;
};

ButtonInteraction.prototype.replyTemporaryMessage = async function (this: ButtonInteraction, temporaryMessage: string | MessagePayload | MessageCreateOptions, duration: number = 5_000) {
  const textChannel = this.message.channel as TextChannel;

  const replyMessage = await textChannel.send(temporaryMessage);

  setTimeout(async () => {
    await Promise.all([
      this.message.delete(),
      replyMessage.delete()
    ]);
  }, duration);

  return replyMessage;
};
