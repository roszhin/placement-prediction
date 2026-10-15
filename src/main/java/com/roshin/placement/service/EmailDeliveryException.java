package com.roshin.placement.service;

public class EmailDeliveryException extends RuntimeException {

    public EmailDeliveryException() {
        super("OTP sending failed. Please try again later.");
    }
}
