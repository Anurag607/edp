"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenuTrigger, DropdownMenuItem, DropdownMenuContent, DropdownMenu } from "@/components/ui/dropdown-menu"
import { CardHeader, CardContent, Card } from "@/components/ui/card"
import Image from "next/image"
import { DropdownMenuIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react"
import moment from "moment";
import axios from "axios";

function formatRelativeTime(isoDateString) {
  const now = moment();
  const futureDate = moment(isoDateString);

  if (!futureDate.isValid()) {
    return 'Invalid date';
  }

  const duration = moment.duration(futureDate.diff(now));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  let result = '';

  if (days > 0) {
    result += `${days} day${days === 1 ? '' : 's'} `;
  }
  if (hours > 0) {
    result += `${hours} hour${hours === 1 ? '' : 's'} `;
  }
  if (minutes > 0 || result === '') {
    result += `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }

  return result.trim();
}

const placeholderLogs = [
  {
    id: 1,
    name: "Front Entrance",
    date: "/placeholder.svg",
    time: "2 min ago",
    message: "Motion detected at the front entrance."
  },
  {
    id: 2,
    name: "Backyard",
    date: "/placeholder.svg",
    time: "10 min ago",
    message: "Motion detected in the backyard."
  },
  {
    id: 3,
    name: "Garage",
    date: "/placeholder.svg",
    time: "30 min ago",
    message: "Motion detected in the garage."
  },
  {
    id: 4,
    name: "Side Entrance",
    date: "/placeholder.svg",
    time: "1 hour ago",
    message: "Motion detected at the side entrance."
  },
  {
    id: 5,
    name: "Front Entrance",
    time: "2 min ago",
    message: "Motion detected at the front entrance."
  }
];

const fetcher = async () => {
  const res = await axios.get("/api/read/", {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache', 
    },
  });

  const body = await res.data;
  return body.data;
}


export function Dashboard() {
  const [imgUrl, setImgUrl] = useState("/placeholder.svg");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    const getLogs = async () => {
      setIsloading(true);
      let data = await fetcher();
      if(data === undefined) {
        setLogs([]);
        return;
      }
      data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      data = data.map((el, _) => {
        let converted_date = formatRelativeTime(el.date);
        if(converted_date[0] === '-') converted_date = converted_date.slice(1) + " ago";

        return {
          ...el,
          date: converted_date
        }
      });
      setLogs(data);
      setIsloading(false);
    }
    getLogs();
    setImgUrl(
      (localStorage.getItem("imgUrl") && typeof localStorage.getItem("imgUrl") !== "string")  ? 
      JSON.parse(localStorage.getItem("imgUrl")).image : "/placeholder.svg"
    );
    
    const intervalId = setInterval(getLogs, 2500);
    
    return () => clearInterval(intervalId);
  }, [])

  return (
    <div className="flex h-full w-full flex-col relative overflow-hidden">
      <header className="flex h-16 items-center justify-end border-b px-6 py-4">
        <div className={"flex gap-4 items-center justify-end"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full bg-neutral-900" size="icon" variant="ghost">
                <DropdownMenuIcon className={"!text-white !font-bold !text-2xl"} height={20} width={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Link className="flex items-center gap-2" href="#">
                  <GlobeIcon className="h-4 w-4" />
                  <span>New York</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="flex items-center gap-2" href="#">
                  <GlobeIcon className="h-4 w-4" />
                  <span>London</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link className="flex items-center gap-2" href="#">
                  <GlobeIcon className="h-4 w-4" />
                  <span>Tokyo</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            <div className={"cursor-default w-[32px] h-[32px] relative grid place-content-center place-items-center"}>
              {(isLoading || true) && (
                <div className={"cube mx-auto !h-[24px] !w-[24px] bg-neutral-900"} />
              )}
            </div>
        </div>
      </header>
      <div className="flex items-start justify-start h-full relative">
          <div
            style={{
              backgroundImage: `url(${imgUrl.image === undefined ? "/placeholder.svg" : imgUrl.image})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            className="h-[90%] w-3/4 object-cover aspect-video rounded-2xl mt-2 mr-2 border-r relative overflow-clip"
          >
            {(imgUrl.date === undefined || imgUrl.message === undefined) ? <></> : (
              <div className="absolute top-0 left-0 w-full bg-black opacity-50 text-right py-1 pr-4">
                <p className={"text-lg text-white font-bold"}>{`${imgUrl.date}: ${imgUrl.message}`}</p>
              </div>
            )}
          </div>
        <div
          className="w-[25%] h-full relative border-l p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Surveillance Logs</h2>
            <p className="text-gray-500">Recent activity from your security cameras.</p>
          </div>
          <div className="max-h-full w-full relative overflow-scroll pb-[10rem] pr-4">
            {logs.length === 0 && (
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CameraIcon className="h-5 w-5 text-gray-200 font-extrabold" />
                    <span className="text-sm font-extrabold">{`No Logs Found`}</span>
                  </div>
                </CardHeader>
              </Card>
            )}
            {logs.map((log, index) => {
              return (
                <Card key={index} className={"mb-4 !cursor-pointer"} onClick={(e) => {
                  e.preventDefault();
                  setImgUrl(log);
                  localStorage.setItem("imgUrl", log.image);
                }}>
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CameraIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium">{`Log 0${index+1}.`}</span> 
                    </div>
                    <span className="text-xs text-gray-500">{log.date}</span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">{log.message}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CameraIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path
        d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>)
  );
}


function GlobeIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>)
  );
}
