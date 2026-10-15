<script>
  

</script>



<style>
  .ticker {
    background: var(--red);
    color: var(--paper-hi);
    border-block: 2px solid var(--ink);
    overflow: hidden;
    white-space: nowrap;
    font-weight: 800;
    font-size: 13px;
    letter-spacing: 0.06em;
  }
  .track {
    display: inline-flex;
    animation: slide 46s linear infinite;
    padding: 8px 0;
  }
  .run {
    display: inline-flex;
    gap: 22px;
    padding-right: 22px;
  }
  i {
    font-style: normal;
    color: var(--ink);
  }
  @keyframes slide {
    to {
      transform: translateX(-50%);
    }
  }
</style>
