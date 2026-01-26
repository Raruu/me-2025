"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";

export interface DBusMessage {
  sender: string; // appId of sender
  target?: string; // appId of target (undefined = broadcast)
  channel: string; // message channel/topic
  data: any; // message payload
  timestamp: number;
}

export interface DBusSubscription {
  id: string;
  appId: string;
  channel: string;
  callback: (message: DBusMessage) => void;
}

export interface DBusService {
  appId: string;
  name: string;
  methods: Record<string, (...args: any[]) => any>;
}

interface DBusContextValue {
  sendMessage: (appId: string, channel: string, data: any, target?: string) => void;
  subscribe: (
    appId: string,
    channel: string,
    callback: (message: DBusMessage) => void,
  ) => () => void;
  registerService: (
    appId: string,
    name: string,
    methods: Record<string, (...args: any[]) => any>,
  ) => void;
  unregisterService: (name: string) => void;
  callService: (
    serviceName: string,
    method: string,
    ...args: any[]
  ) => Promise<any>;
  registerApp: (appId: string, windowId: number) => void;
  unregisterApp: (appId: string) => void;
  getActiveApps: () => string[];
}

const DBusContext = createContext<DBusContextValue | null>(null);

export const useDBus = () => {
  const context = useContext(DBusContext);
  if (!context) {
    throw new Error("useDBus must be used within DBusProvider");
  }
  return context;
};

interface DBusProviderProps {
  children: React.ReactNode;
}

export const DBusProvider: React.FC<DBusProviderProps> = ({ children }) => {
  const subscriptionsRef = useRef<Map<string, DBusSubscription[]>>(new Map());
  const servicesRef = useRef<Map<string, DBusService>>(new Map());
  const activeAppsRef = useRef<Map<string, number>>(new Map()); // appId -> windowId

  const registerApp = useCallback((appId: string, windowId: number) => {
    activeAppsRef.current.set(appId, windowId);
    console.log(`[DBus] App registered: ${appId} (window: ${windowId})`);
  }, []);

  const unregisterApp = useCallback((appId: string) => {
    activeAppsRef.current.delete(appId);
    // Clean up subscriptions
    subscriptionsRef.current.forEach((subs, channel) => {
      subscriptionsRef.current.set(
        channel,
        subs.filter((sub) => sub.appId !== appId),
      );
    });
    // Clean up services
    servicesRef.current.forEach((service, name) => {
      if (service.appId === appId) {
        servicesRef.current.delete(name);
      }
    });
    console.log(`[DBus] App unregistered: ${appId}`);
  }, []);

  const getActiveApps = useCallback(() => {
    return Array.from(activeAppsRef.current.keys());
  }, []);

  const sendMessage = useCallback(
    (appId: string, channel: string, data: any, target?: string) => {
      const message: DBusMessage = {
        sender: appId || "system",
        target,
        channel,
        data,
        timestamp: Date.now(),
      };
      
      console.log(`[DBus] Message sent on channel "${channel}" from ${appId}:`, message);
      
      const subscribers = subscriptionsRef.current.get(channel) || [];
      
      subscribers.forEach((sub) => {
        // If target is specified, only send to that app
        if (target && sub.appId !== target) return;

        // Don't send message back to sender (unless broadcast)
        if (target != null && sub.appId === message.sender) return;

        try {
          sub.callback(message);
        } catch (error) {
          console.error(`[DBus] Error in subscription callback:`, error);
        }
      });
    },
    [],
  );

  const subscribe = useCallback(
    (appId: string, channel: string, callback: (message: DBusMessage) => void) => {
      const subscription: DBusSubscription = {
        id: `${appId || "unknown"}-${Date.now()}-${Math.random()}`,
        appId: appId || "unknown",
        channel,
        callback,
      };

      const existingSubs = subscriptionsRef.current.get(channel) || [];
      subscriptionsRef.current.set(channel, [...existingSubs, subscription]);

      console.log(
        `[DBus] Subscribed to channel "${channel}" (app: ${subscription.appId})`,
      );

      // Return unsubscribe function
      return () => {
        const subs = subscriptionsRef.current.get(channel) || [];
        subscriptionsRef.current.set(
          channel,
          subs.filter((sub) => sub.id !== subscription.id),
        );
        console.log(`[DBus] Unsubscribed from channel "${channel}" (app: ${appId})`);
      };
    },
    [],
  );

  const registerService = useCallback(
    (appId: string, name: string, methods: Record<string, (...args: any[]) => any>) => {
      const service: DBusService = {
        appId: appId || "unknown",
        name,
        methods,
      };

      servicesRef.current.set(name, service);
      console.log(`[DBus] Service registered: ${name} (app: ${service.appId})`);
    },
    [],
  );

  const unregisterService = useCallback((name: string) => {
    servicesRef.current.delete(name);
    console.log(`[DBus] Service unregistered: ${name}`);
  }, []);

  const callService = useCallback(
    async (serviceName: string, method: string, ...args: any[]) => {
      const service = servicesRef.current.get(serviceName);

      if (!service) {
        throw new Error(`Service "${serviceName}" not found`);
      }

      if (!service.methods[method]) {
        throw new Error(
          `Method "${method}" not found in service "${serviceName}"`,
        );
      }

      console.log(`[DBus] Calling service "${serviceName}.${method}"`, args);

      try {
        const result = await service.methods[method](...args);
        return result;
      } catch (error) {
        console.error(`[DBus] Error calling service method:`, error);
        throw error;
      }
    },
    [],
  );

  const contextValue: DBusContextValue = {
    sendMessage,
    subscribe,
    registerService,
    unregisterService,
    callService,
    registerApp,
    unregisterApp,
    getActiveApps,
  };

  return (
    <DBusContext.Provider value={contextValue}>{children}</DBusContext.Provider>
  );
};

