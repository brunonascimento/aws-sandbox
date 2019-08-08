#!/bin/bash

dryrun=true

function validate_input()
{
    if [ "$dryrun" = true ]
    then
        echo "running in dryrun mode"
    else
        echo "WARNING: this script will execute commands on your aws account"
    fi 
}

function list_ec2()
{
    #$aws ec2 describe-instances --region us-west-2 --query "Reservations[].Instances[].[{InstanceId:InstanceId},{IamInstanceProfile:IamInstanceProfile.Arn }]"

    roles=( $( aws ec2 describe-instances --region us-west-2 --query "Reservations[].Instances[].[{Arn:IamInstanceProfile.Arn }]" |
        jq -c '.[] ' | jq -c '.[]' | jq -c '.[]' | cut -d "/" -f2 | tr -d '"' | sort -du ) )

}

function attach_role()
{
    echo "the following roles will be processed: "

    for element in "${roles[@]}"
    do
        echo "aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM --role-name "$element" "
        if [ "$dryrun" = false ]
        then
            $( aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM --role-name "$element" )
        fi
    done

}

echo "This script add the SSM Role for Each EC2 IAM Role"
echo "Notice that scripts needs 'jq' to run - if you don't have run 'brew install jq' (for mac user) "

validate_input

list_ec2

attach_role