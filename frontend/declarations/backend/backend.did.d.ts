import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Task {
  'id' : bigint,
  'createdAt' : Time,
  'completed' : boolean,
  'description' : string,
}
export type Time = bigint;
export interface _SERVICE {
  'addTask' : ActorMethod<[string], bigint>,
  'completeTask' : ActorMethod<[bigint], boolean>,
  'deleteTask' : ActorMethod<[bigint], boolean>,
  'getTasks' : ActorMethod<[], Array<Task>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
