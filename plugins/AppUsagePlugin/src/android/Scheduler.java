package com.yona.plugin.services;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

class Scheduler
{

    private static ScheduledExecutorService scheduler;

    /**
	 * Gets initialize scheduler.
	 *
	 * @return the initialize scheduler
	 */
	public static ScheduledExecutorService getInitializeScheduler()
	{
		if (scheduler == null)
		{
			scheduler = Executors.newSingleThreadScheduledExecutor();
		}
		return scheduler;
	}

	/**
	 * Gets scheduler.
	 *
	 * @return the scheduler
	 */
	public static ScheduledExecutorService getScheduler()
	{
		return Scheduler.scheduler;
	}

	/**
	 * Sets null scheduler.
	 */
	public static void setNullScheduler()
	{
		if (scheduler != null)
		{
			scheduler.shutdown();
		}
		scheduler = null;
	}
}
