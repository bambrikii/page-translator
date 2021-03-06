import React, { Component } from 'react';
import './NotFound.css';
import { RouteIconButton } from "../route/RouteIconButton";

export const NotFound = () => {
  return (
    <div className="page-not-found">
      <h1 className="title">404</h1>
      <div className="desc">The Page you're looking for was not found.</div>
      <RouteIconButton href="/">Go Back</RouteIconButton>
    </div>
  );
}
