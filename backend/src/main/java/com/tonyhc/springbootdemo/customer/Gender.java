package com.tonyhc.springbootdemo.customer;

public enum Gender {
    MALE("MALE"), FEMALE("FEMALE"), STRAIGHT("STRAIGHT");
    private final String identity;

    Gender(String identity) {
        this.identity = identity;
    }

    public String getIdentity() {
        return identity;
    }
}
