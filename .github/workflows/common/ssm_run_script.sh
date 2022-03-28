## Create your script in JSON format
cat <<EOF > myScript.json
{
  "Parameters": {
    "commands": [
      "#!/bin/bash",
      "sudo su",
      "runuser -l ubuntu -c 'cd /home/ubuntu/human-app-ui && TAG=$IMAGE_TAG ./run.sh'"
    ]
  }
}
EOF

for instance_id in "${INSTANCE_IDS}"
do
  ## Execute a script throuh SSM Run Command default AWS-RunShellScript document
  AWS_SSM_RUN_COMMAND_ID=$(aws ssm send-command \
    --instance-ids "${instance_id}" \
    --document-name "AWS-RunShellScript" \
    --comment "Run shell script on Linux Instances" \
    --cli-input-json file://myScript.json \
    --output text --query "Command.CommandId")
  ## Waiting for command execution
  wait_time=0
  until [[ $wait_time -eq 30 ]] || [[ $AWS_SSM_COMMAND_STATUS == "Success" ]]; do
    AWS_SSM_COMMAND_STATUS=$(aws ssm list-command-invocations --command-id "$AWS_SSM_RUN_COMMAND_ID" --query "CommandInvocations[].Status" --output text)
    sleep 5;
    echo "Waiting for command execution. Status - $AWS_SSM_COMMAND_STATUS"
    let "wait_time+=1"
  done;
  ## Get command execution output
  aws ssm list-command-invocations \
    --command-id "$AWS_SSM_RUN_COMMAND_ID" \
    --details \
    --query "CommandInvocations[].CommandPlugins[].Output" \
    --output text
done
