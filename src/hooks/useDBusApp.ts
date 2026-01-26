import { useDBus, DBusMessage } from "@/providers/DBusContext";
import { useEffect } from "react";

export const useDBusApp = (appId: string, windowId: number) => {
  const dbus = useDBus();

  useEffect(() => {
    dbus.registerApp(appId, windowId);
    return () => {
      dbus.unregisterApp(appId);
    };
  }, [appId, windowId, dbus]);

  // Return app-scoped methods that automatically include appId
  return {
    sendMessage: (channel: string, data: any, target?: string) =>
      dbus.sendMessage(appId, channel, data, target),
    subscribe: (channel: string, callback: (message: DBusMessage) => void) =>
      dbus.subscribe(appId, channel, callback),
    registerService: (
      name: string,
      methods: Record<string, (...args: any[]) => any>,
    ) => dbus.registerService(appId, name, methods),
    unregisterService: dbus.unregisterService,
    callService: dbus.callService,
    getActiveApps: dbus.getActiveApps,
  };
};
