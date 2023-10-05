import React, {useEffect, useState} from "react";

// https://stackoverflow.com/questions/30803440/delayed-rendering-of-react-components
interface DelayProps {
    children: React.ReactNode;
    waitBeforeShow: number;
}

const Delay = ({children, waitBeforeShow}: DelayProps) => {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const timer: NodeJS.Timeout = setTimeout(() => {
            setIsShown(true);
        }, waitBeforeShow);

        return () => {
            clearTimeout(timer);
        }
    }, [waitBeforeShow]);

    return isShown ? children : null;
};

export default Delay;