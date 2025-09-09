// Missing Intel Xeon E5 CPUs to Add to Database
// Format: { name: "E5-XXXX", generation: "vX", cores: X, threads: X, baseClock: "X.X GHz", turboClock: "X.X GHz", cache: "X MB", tdp: "XW", socket: "LGA XXXX", ocMax: "X.X GHz*" }

const missingCPUs = {
    // v1 Generation (Sandy Bridge-EP) - 8 Missing CPUs
    v1: [
        // E5-1680 needs to be added (no E5-1680 in current database, only E5-1680 v2)
        { name: "E5-1680", generation: "v1", cores: 8, threads: 16, baseClock: "3.2 GHz", turboClock: "3.9 GHz", cache: "25 MB", tdp: "130W", socket: "LGA 2011", ocMax: "4.3 GHz" },
        
        // E5-1428L
        { name: "E5-1428L", generation: "v1", cores: 6, threads: 12, baseClock: "1.8 GHz", turboClock: "-", cache: "15 MB", tdp: "60W", socket: "LGA 2011", ocMax: "2.0 GHz*" },
        
        // E5-2400 series
        { name: "E5-2403", generation: "v1", cores: 4, threads: 4, baseClock: "1.8 GHz", turboClock: "-", cache: "10 MB", tdp: "80W", socket: "LGA 2011", ocMax: "2.0 GHz*" },
        { name: "E5-2407", generation: "v1", cores: 4, threads: 4, baseClock: "2.2 GHz", turboClock: "-", cache: "10 MB", tdp: "80W", socket: "LGA 2011", ocMax: "2.4 GHz*" },
        { name: "E5-2418L", generation: "v1", cores: 4, threads: 8, baseClock: "2.0 GHz", turboClock: "2.1 GHz", cache: "10 MB", tdp: "50W", socket: "LGA 2011", ocMax: "2.3 GHz*" },
        { name: "E5-2420", generation: "v1", cores: 6, threads: 12, baseClock: "1.9 GHz", turboClock: "2.4 GHz", cache: "15 MB", tdp: "95W", socket: "LGA 2011", ocMax: "2.6 GHz*" },
        { name: "E5-2428L", generation: "v1", cores: 6, threads: 12, baseClock: "1.8 GHz", turboClock: "2.0 GHz", cache: "15 MB", tdp: "60W", socket: "LGA 2011", ocMax: "2.2 GHz*" },
        { name: "E5-2430", generation: "v1", cores: 6, threads: 12, baseClock: "2.2 GHz", turboClock: "2.7 GHz", cache: "15 MB", tdp: "95W", socket: "LGA 2011", ocMax: "2.9 GHz*" },
        { name: "E5-2440", generation: "v1", cores: 6, threads: 12, baseClock: "2.4 GHz", turboClock: "2.9 GHz", cache: "15 MB", tdp: "95W", socket: "LGA 2011", ocMax: "3.1 GHz*" },
        { name: "E5-2448L", generation: "v1", cores: 8, threads: 16, baseClock: "1.8 GHz", turboClock: "2.1 GHz", cache: "20 MB", tdp: "70W", socket: "LGA 2011", ocMax: "2.3 GHz*" },
        { name: "E5-2450", generation: "v1", cores: 8, threads: 16, baseClock: "2.1 GHz", turboClock: "2.9 GHz", cache: "20 MB", tdp: "95W", socket: "LGA 2011", ocMax: "3.1 GHz*" },
        { name: "E5-2450L", generation: "v1", cores: 8, threads: 16, baseClock: "1.8 GHz", turboClock: "2.3 GHz", cache: "20 MB", tdp: "70W", socket: "LGA 2011", ocMax: "2.5 GHz*" },
        { name: "E5-2470", generation: "v1", cores: 8, threads: 16, baseClock: "2.3 GHz", turboClock: "3.1 GHz", cache: "20 MB", tdp: "95W", socket: "LGA 2011", ocMax: "3.3 GHz*" },
    ],
    
    // v2 Generation (Ivy Bridge-EP) - 8 Missing CPUs
    v2: [
        { name: "E5-1680 v2", generation: "v2", cores: 8, threads: 16, baseClock: "3.0 GHz", turboClock: "3.9 GHz", cache: "25 MB", tdp: "130W", socket: "LGA 2011", ocMax: "4.3 GHz" },
        { name: "E5-1428L v2", generation: "v2", cores: 6, threads: 12, baseClock: "2.2 GHz", turboClock: "2.7 GHz", cache: "15 MB", tdp: "60W", socket: "LGA 2011", ocMax: "3.0 GHz*" },
        { name: "E5-2403 v2", generation: "v2", cores: 4, threads: 4, baseClock: "1.8 GHz", turboClock: "1.8 GHz", cache: "10 MB", tdp: "80W", socket: "LGA 2011", ocMax: "2.0 GHz*" },
        { name: "E5-2407 v2", generation: "v2", cores: 4, threads: 4, baseClock: "2.4 GHz", turboClock: "2.4 GHz", cache: "10 MB", tdp: "80W", socket: "LGA 2011", ocMax: "2.6 GHz*" },
        { name: "E5-2418L v2", generation: "v2", cores: 6, threads: 12, baseClock: "2.0 GHz", turboClock: "2.0 GHz", cache: "15 MB", tdp: "50W", socket: "LGA 2011", ocMax: "2.2 GHz*" },
        { name: "E5-2420 v2", generation: "v2", cores: 6, threads: 12, baseClock: "2.2 GHz", turboClock: "2.7 GHz", cache: "15 MB", tdp: "80W", socket: "LGA 2011", ocMax: "2.9 GHz*" },
        { name: "E5-2428L v2", generation: "v2", cores: 8, threads: 16, baseClock: "1.8 GHz", turboClock: "2.3 GHz", cache: "20 MB", tdp: "60W", socket: "LGA 2011", ocMax: "2.5 GHz*" },
        { name: "E5-2430 v2", generation: "v2", cores: 6, threads: 12, baseClock: "2.5 GHz", turboClock: "3.0 GHz", cache: "15 MB", tdp: "80W", socket: "LGA 2011", ocMax: "3.2 GHz*" },
        { name: "E5-2440 v2", generation: "v2", cores: 8, threads: 16, baseClock: "1.9 GHz", turboClock: "2.4 GHz", cache: "20 MB", tdp: "95W", socket: "LGA 2011", ocMax: "2.6 GHz*" },
        { name: "E5-2448L v2", generation: "v2", cores: 10, threads: 20, baseClock: "1.8 GHz", turboClock: "2.4 GHz", cache: "25 MB", tdp: "70W", socket: "LGA 2011", ocMax: "2.6 GHz*" },
        { name: "E5-2450 v2", generation: "v2", cores: 8, threads: 16, baseClock: "2.5 GHz", turboClock: "3.3 GHz", cache: "20 MB", tdp: "95W", socket: "LGA 2011", ocMax: "3.5 GHz*" },
        { name: "E5-2450L v2", generation: "v2", cores: 10, threads: 20, baseClock: "1.7 GHz", turboClock: "2.1 GHz", cache: "25 MB", tdp: "60W", socket: "LGA 2011", ocMax: "2.3 GHz*" },
        { name: "E5-2470 v2", generation: "v2", cores: 10, threads: 20, baseClock: "2.4 GHz", turboClock: "3.2 GHz", cache: "25 MB", tdp: "95W", socket: "LGA 2011", ocMax: "3.4 GHz*" },
        { name: "E5-2651 v2", generation: "v2", cores: 12, threads: 24, baseClock: "1.8 GHz", turboClock: "2.4 GHz", cache: "30 MB", tdp: "105W", socket: "LGA 2011", ocMax: "2.6 GHz*" },
    ],
    
    // v3 Generation (Haswell-EP) - 29 Missing CPUs
    v3: [
        // E5-1600 v3 series
        { name: "E5-1630 v3", generation: "v3", cores: 4, threads: 8, baseClock: "3.7 GHz", turboClock: "3.8 GHz", cache: "10 MB", tdp: "140W", socket: "LGA 2011-3", ocMax: "4.2 GHz" },
        { name: "E5-1680 v3", generation: "v3", cores: 8, threads: 16, baseClock: "3.2 GHz", turboClock: "3.8 GHz", cache: "20 MB", tdp: "140W", socket: "LGA 2011-3", ocMax: "4.2 GHz" },
        
        // E5-2400/2600 v3 series
        { name: "E5-1428L v3", generation: "v3", cores: 8, threads: 16, baseClock: "2.0 GHz", turboClock: "-", cache: "20 MB", tdp: "65W", socket: "LGA 2011-3", ocMax: "2.2 GHz*" },
        { name: "E5-2408L v3", generation: "v3", cores: 4, threads: 8, baseClock: "1.8 GHz", turboClock: "-", cache: "10 MB", tdp: "45W", socket: "LGA 2011-3", ocMax: "2.0 GHz*" },
        { name: "E5-2418L v3", generation: "v3", cores: 6, threads: 12, baseClock: "2.0 GHz", turboClock: "-", cache: "15 MB", tdp: "50W", socket: "LGA 2011-3", ocMax: "2.2 GHz*" },
        { name: "E5-2428L v3", generation: "v3", cores: 8, threads: 16, baseClock: "1.8 GHz", turboClock: "-", cache: "20 MB", tdp: "55W", socket: "LGA 2011-3", ocMax: "2.0 GHz*" },
        { name: "E5-2438L v3", generation: "v3", cores: 10, threads: 20, baseClock: "1.8 GHz", turboClock: "-", cache: "25 MB", tdp: "70W", socket: "LGA 2011-3", ocMax: "2.0 GHz*" },
        { name: "E5-2603 v3", generation: "v3", cores: 6, threads: 6, baseClock: "1.6 GHz", turboClock: "-", cache: "15 MB", tdp: "85W", socket: "LGA 2011-3", ocMax: "1.8 GHz*" },
        { name: "E5-2608L v3", generation: "v3", cores: 6, threads: 12, baseClock: "2.0 GHz", turboClock: "-", cache: "15 MB", tdp: "52W", socket: "LGA 2011-3", ocMax: "2.2 GHz*" },
        { name: "E5-2609 v3", generation: "v3", cores: 6, threads: 6, baseClock: "1.9 GHz", turboClock: "-", cache: "15 MB", tdp: "85W", socket: "LGA 2011-3", ocMax: "2.1 GHz*" },
        { name: "E5-2618L v3", generation: "v3", cores: 8, threads: 16, baseClock: "2.3 GHz", turboClock: "3.4 GHz", cache: "20 MB", tdp: "75W", socket: "LGA 2011-3", ocMax: "3.6 GHz*" },
        { name: "E5-2623 v3", generation: "v3", cores: 4, threads: 8, baseClock: "3.0 GHz", turboClock: "3.5 GHz", cache: "10 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "3.7 GHz*" },
        { name: "E5-2628L v3", generation: "v3", cores: 10, threads: 20, baseClock: "2.0 GHz", turboClock: "2.5 GHz", cache: "25 MB", tdp: "75W", socket: "LGA 2011-3", ocMax: "2.7 GHz*" },
        { name: "E5-2630L v3", generation: "v3", cores: 8, threads: 16, baseClock: "1.8 GHz", turboClock: "2.9 GHz", cache: "20 MB", tdp: "55W", socket: "LGA 2011-3", ocMax: "3.1 GHz*" },
        { name: "E5-2637 v3", generation: "v3", cores: 4, threads: 8, baseClock: "3.5 GHz", turboClock: "3.7 GHz", cache: "15 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.9 GHz*" },
        { name: "E5-2643 v3", generation: "v3", cores: 6, threads: 12, baseClock: "3.4 GHz", turboClock: "3.7 GHz", cache: "20 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.9 GHz*" },
        { name: "E5-2648L v3", generation: "v3", cores: 12, threads: 24, baseClock: "1.8 GHz", turboClock: "2.5 GHz", cache: "30 MB", tdp: "75W", socket: "LGA 2011-3", ocMax: "2.7 GHz*" },
        { name: "E5-2650L v3", generation: "v3", cores: 12, threads: 24, baseClock: "1.8 GHz", turboClock: "2.5 GHz", cache: "30 MB", tdp: "65W", socket: "LGA 2011-3", ocMax: "2.7 GHz*" },
        { name: "E5-2658 v3", generation: "v3", cores: 12, threads: 24, baseClock: "2.2 GHz", turboClock: "2.9 GHz", cache: "30 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "3.1 GHz*" },
        { name: "E5-2658A v3", generation: "v3", cores: 12, threads: 24, baseClock: "2.2 GHz", turboClock: "2.9 GHz", cache: "30 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "3.1 GHz*" },
        { name: "E5-2667 v3", generation: "v3", cores: 8, threads: 16, baseClock: "3.2 GHz", turboClock: "3.6 GHz", cache: "20 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.8 GHz*" },
        { name: "E5-2683 v3", generation: "v3", cores: 14, threads: 28, baseClock: "2.0 GHz", turboClock: "3.0 GHz", cache: "35 MB", tdp: "120W", socket: "LGA 2011-3", ocMax: "3.2 GHz*" },
        { name: "E5-2687W v3", generation: "v3", cores: 10, threads: 20, baseClock: "3.1 GHz", turboClock: "3.5 GHz", cache: "25 MB", tdp: "160W", socket: "LGA 2011-3", ocMax: "3.7 GHz*" },
        
        // E5-4600 v3 series (all missing)
        { name: "E5-4610 v3", generation: "v3", cores: 10, threads: 20, baseClock: "1.7 GHz", turboClock: "1.7 GHz", cache: "25 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "1.9 GHz*" },
        { name: "E5-4620 v3", generation: "v3", cores: 10, threads: 20, baseClock: "2.0 GHz", turboClock: "2.6 GHz", cache: "25 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "2.8 GHz*" },
        { name: "E5-4627 v3", generation: "v3", cores: 10, threads: 10, baseClock: "2.6 GHz", turboClock: "3.2 GHz", cache: "25 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.4 GHz*" },
        { name: "E5-4640 v3", generation: "v3", cores: 12, threads: 24, baseClock: "1.9 GHz", turboClock: "2.6 GHz", cache: "30 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "2.8 GHz*" },
        { name: "E5-4648 v3", generation: "v3", cores: 12, threads: 24, baseClock: "1.7 GHz", turboClock: "2.2 GHz", cache: "30 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "2.4 GHz*" },
        { name: "E5-4650 v3", generation: "v3", cores: 12, threads: 24, baseClock: "2.1 GHz", turboClock: "2.8 GHz", cache: "30 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "3.0 GHz*" },
        { name: "E5-4655 v3", generation: "v3", cores: 6, threads: 12, baseClock: "2.9 GHz", turboClock: "3.2 GHz", cache: "30 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.4 GHz*" },
        { name: "E5-4660 v3", generation: "v3", cores: 14, threads: 28, baseClock: "2.1 GHz", turboClock: "2.9 GHz", cache: "35 MB", tdp: "120W", socket: "LGA 2011-3", ocMax: "3.1 GHz*" },
        { name: "E5-4667 v3", generation: "v3", cores: 16, threads: 32, baseClock: "2.0 GHz", turboClock: "2.9 GHz", cache: "40 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.1 GHz*" },
        { name: "E5-4669 v3", generation: "v3", cores: 18, threads: 36, baseClock: "2.1 GHz", turboClock: "2.9 GHz", cache: "45 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.1 GHz*" },
    ],
    
    // v4 Generation (Broadwell-EP) - 28 Missing CPUs
    v4: [
        // E5-1600 v4 series
        { name: "E5-1630 v4", generation: "v4", cores: 4, threads: 8, baseClock: "3.7 GHz", turboClock: "4.0 GHz", cache: "10 MB", tdp: "140W", socket: "LGA 2011-3", ocMax: "4.4 GHz" },
        { name: "E5-1680 v4", generation: "v4", cores: 8, threads: 16, baseClock: "3.4 GHz", turboClock: "4.0 GHz", cache: "20 MB", tdp: "140W", socket: "LGA 2011-3", ocMax: "4.4 GHz" },
        
        // E5-2600 v4 series
        { name: "E5-2603 v4", generation: "v4", cores: 6, threads: 6, baseClock: "1.7 GHz", turboClock: "-", cache: "15 MB", tdp: "85W", socket: "LGA 2011-3", ocMax: "1.9 GHz*" },
        { name: "E5-2608L v4", generation: "v4", cores: 8, threads: 16, baseClock: "1.6 GHz", turboClock: "1.7 GHz", cache: "20 MB", tdp: "50W", socket: "LGA 2011-3", ocMax: "1.9 GHz*" },
        { name: "E5-2609 v4", generation: "v4", cores: 8, threads: 8, baseClock: "1.7 GHz", turboClock: "-", cache: "20 MB", tdp: "85W", socket: "LGA 2011-3", ocMax: "1.9 GHz*" },
        { name: "E5-2618L v4", generation: "v4", cores: 10, threads: 20, baseClock: "2.2 GHz", turboClock: "3.2 GHz", cache: "25 MB", tdp: "75W", socket: "LGA 2011-3", ocMax: "3.4 GHz*" },
        { name: "E5-2623 v4", generation: "v4", cores: 4, threads: 8, baseClock: "2.6 GHz", turboClock: "3.2 GHz", cache: "10 MB", tdp: "85W", socket: "LGA 2011-3", ocMax: "3.4 GHz*" },
        { name: "E5-2628L v4", generation: "v4", cores: 12, threads: 24, baseClock: "1.9 GHz", turboClock: "2.4 GHz", cache: "30 MB", tdp: "75W", socket: "LGA 2011-3", ocMax: "2.6 GHz*" },
        { name: "E5-2630L v4", generation: "v4", cores: 10, threads: 20, baseClock: "1.8 GHz", turboClock: "2.9 GHz", cache: "25 MB", tdp: "55W", socket: "LGA 2011-3", ocMax: "3.1 GHz*" },
        { name: "E5-2637 v4", generation: "v4", cores: 4, threads: 8, baseClock: "3.5 GHz", turboClock: "3.7 GHz", cache: "15 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.9 GHz*" },
        { name: "E5-2643 v4", generation: "v4", cores: 6, threads: 12, baseClock: "3.4 GHz", turboClock: "3.7 GHz", cache: "20 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.9 GHz*" },
        { name: "E5-2648L v4", generation: "v4", cores: 14, threads: 28, baseClock: "1.8 GHz", turboClock: "2.5 GHz", cache: "35 MB", tdp: "75W", socket: "LGA 2011-3", ocMax: "2.7 GHz*" },
        { name: "E5-2650L v4", generation: "v4", cores: 14, threads: 28, baseClock: "1.7 GHz", turboClock: "2.5 GHz", cache: "35 MB", tdp: "65W", socket: "LGA 2011-3", ocMax: "2.7 GHz*" },
        { name: "E5-2658 v4", generation: "v4", cores: 14, threads: 28, baseClock: "2.3 GHz", turboClock: "2.8 GHz", cache: "35 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "3.0 GHz*" },
        { name: "E5-2667 v4", generation: "v4", cores: 8, threads: 16, baseClock: "3.2 GHz", turboClock: "3.6 GHz", cache: "25 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.8 GHz*" },
        { name: "E5-2683 v4", generation: "v4", cores: 16, threads: 32, baseClock: "2.1 GHz", turboClock: "3.0 GHz", cache: "40 MB", tdp: "120W", socket: "LGA 2011-3", ocMax: "3.2 GHz*" },
        { name: "E5-2687W v4", generation: "v4", cores: 12, threads: 24, baseClock: "3.0 GHz", turboClock: "3.5 GHz", cache: "30 MB", tdp: "160W", socket: "LGA 2011-3", ocMax: "3.7 GHz*" },
        { name: "E5-2697A v4", generation: "v4", cores: 16, threads: 32, baseClock: "2.6 GHz", turboClock: "3.6 GHz", cache: "40 MB", tdp: "145W", socket: "LGA 2011-3", ocMax: "3.8 GHz*" },
        { name: "E5-2699A v4", generation: "v4", cores: 22, threads: 44, baseClock: "2.4 GHz", turboClock: "3.6 GHz", cache: "55 MB", tdp: "145W", socket: "LGA 2011-3", ocMax: "3.8 GHz*" },
        { name: "E5-2699R v4", generation: "v4", cores: 22, threads: 44, baseClock: "2.2 GHz", turboClock: "3.6 GHz", cache: "55 MB", tdp: "145W", socket: "LGA 2011-3", ocMax: "3.8 GHz*" },
        
        // E5-4600 v4 series (all missing)
        { name: "E5-4610 v4", generation: "v4", cores: 10, threads: 20, baseClock: "1.8 GHz", turboClock: "1.8 GHz", cache: "25 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "2.0 GHz*" },
        { name: "E5-4620 v4", generation: "v4", cores: 10, threads: 20, baseClock: "2.1 GHz", turboClock: "2.6 GHz", cache: "25 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "2.8 GHz*" },
        { name: "E5-4627 v4", generation: "v4", cores: 10, threads: 10, baseClock: "2.6 GHz", turboClock: "3.2 GHz", cache: "25 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.4 GHz*" },
        { name: "E5-4628L v4", generation: "v4", cores: 14, threads: 28, baseClock: "1.8 GHz", turboClock: "2.2 GHz", cache: "35 MB", tdp: "75W", socket: "LGA 2011-3", ocMax: "2.4 GHz*" },
        { name: "E5-4640 v4", generation: "v4", cores: 12, threads: 24, baseClock: "2.1 GHz", turboClock: "2.6 GHz", cache: "30 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "2.8 GHz*" },
        { name: "E5-4650 v4", generation: "v4", cores: 14, threads: 28, baseClock: "2.2 GHz", turboClock: "2.8 GHz", cache: "35 MB", tdp: "105W", socket: "LGA 2011-3", ocMax: "3.0 GHz*" },
        { name: "E5-4655 v4", generation: "v4", cores: 8, threads: 16, baseClock: "2.5 GHz", turboClock: "3.2 GHz", cache: "30 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.4 GHz*" },
        { name: "E5-4660 v4", generation: "v4", cores: 16, threads: 32, baseClock: "2.2 GHz", turboClock: "3.0 GHz", cache: "40 MB", tdp: "120W", socket: "LGA 2011-3", ocMax: "3.2 GHz*" },
        { name: "E5-4667 v4", generation: "v4", cores: 18, threads: 36, baseClock: "2.2 GHz", turboClock: "3.0 GHz", cache: "45 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.2 GHz*" },
        { name: "E5-4669 v4", generation: "v4", cores: 22, threads: 44, baseClock: "2.2 GHz", turboClock: "3.0 GHz", cache: "55 MB", tdp: "135W", socket: "LGA 2011-3", ocMax: "3.2 GHz*" },
    ]
};

// Note: The ocMax values marked with * are estimated based on typical overclocking headroom for each generation
// Actual overclocking results may vary based on cooling, motherboard, and silicon lottery