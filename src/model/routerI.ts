import { Router, Request, Response, NextFunction } from "express";

export interface RouterI {
    route: string;
    router: Router;
}