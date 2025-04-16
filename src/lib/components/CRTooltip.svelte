<script lang="ts">
  type PROPS = {};
  let;
</script>

<div class="tooltip-wrapper">
  <button style="width:100%">Post content is here having a tooltip</button>
  <!-- tooltip-local is the default class for this tooltip and could be
      overridden by local rules in the component itself
  -->
  <!-- NOTE: for <CRTooltip content is sent as a reference to parent snippet 
      that renders actual markup content with inline styles or sending a
      reference to parent class sent as a prompt to <CRTooltip class={tooltip-class}
      defined as :global(tooltip-class)
  -->
  <Tooltip defaultClass="tooltip-local">
    <p>created on</p>
    <p class="prop-value">{createdAt.toLocaleString()}</p>
    <p>updated on</p>
    <p class="prop-value">{updatedAt?.toLocaleString()}</p>
  </Tooltip>
</div>
