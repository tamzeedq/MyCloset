export interface WeatherData {
    weather: { 
      icon: string; 
      description: string;
      main: string;
    }[];
    main: { 
      temp: number; 
      humidity: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
    };
    wind: {
      speed: number;
      deg: number;
    };
    name: string;
}

export interface HourlyForecast {
    dt: number;
    temp: number;
    main: {
      temp: number;
      feels_like: number;
    }
    weather: [{
        icon: string;
        description: string;
    }];
}

export interface WeatherForecast {
    hourly: HourlyForecast[];   
}

export interface ImageListProps {
    test_arr?: number[];
    title: string;
}