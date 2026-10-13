export interface MetricTimer {
  count: number;
  mean: number;
  max: number;
  '0.0': number;
  '0.5': number;
  '0.75': number;
  '0.95': number;
  '0.99': number;
}

export type JvmMemoryMetrics = Record<string, { used: number; max: number; committed: number }>;
export type CacheMetrics = Record<string, {
  'cache.gets.hit': number;
  'cache.gets.miss': number;
  'cache.puts': number;
  'cache.removals': number;
  'cache.evictions': number;
}>;
export type EndpointsMetrics = Record<string, Record<string, MetricTimer>>;
export interface RequestMetrics {
  all: { count: number };
  percode: Record<string, { count: number; mean: number; max: number }>;
}
export interface DatasourceMetrics {
  active: { value: number };
  min: { value: number };
  max: { value: number };
  idle: { value: number };
  usage: MetricTimer;
  acquire: MetricTimer;
  creation: MetricTimer;
}
export type SystemMetrics = Record<string, number>;
export interface GarbageCollectorMetrics {
  'jvm.gc.live.data.size': number;
  'jvm.gc.max.data.size': number;
  'jvm.gc.memory.promoted': number;
  'jvm.gc.memory.allocated': number;
  classesLoaded: number;
  classesUnloaded: number;
  'jvm.gc.pause': MetricTimer;
}
export interface ThreadInfo {
  threadState: string;
  threadId: number;
  threadName: string;
  lockName: string;
  blockedTime: number;
  blockedCount: number;
  waitedTime: number;
  waitedCount: number;
  stackTrace: { className: string; methodName: string; fileName: string; lineNumber: number }[];
}
