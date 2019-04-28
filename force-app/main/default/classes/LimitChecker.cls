public class LimitChecker {
    public static void LimitChecker() {
        System.debug('Limit Aggregate '+System.limits.getLimitAggregateQueries() + ' / ' + System.limits.getAggregateQueries());
        System.debug('Limit Callout '+System.limits.getLimitCallouts() + ' / ' + System.limits.getCallouts());
        System.debug('CPU Time '+System.limits.getLimitCpuTime() + ' / ' + System.limits.getCpuTime());
        System.debug('Limit DML Rows '+System.limits.getLimitDMLRows() + ' / ' + System.limits.getDmlRows());
        System.debug('Limit DML Statements '+System.limits.getLimitDMLStatements() + ' / ' + System.limits.getDmlStatements());
        System.debug('Limit Email Invocation '+System.limits.getLimitEmailInvocations() + ' / ' + System.limits.getEmailInvocations());
        System.debug('Limit find similar call '+System.limits.getLimitFindSimilarCalls() + ' / ' + System.limits.getFindSimilarCalls());
        System.debug('Future calls '+System.limits.getLimitFutureCalls() + ' / ' + System.limits.getFutureCalls());
        System.debug('Limit heap size '+System.limits.getLimitHeapSize() + ' / ' + System.limits.getHeapSize());
        System.debug('Limit queries '+System.limits.getLimitQueries() + ' / ' + System.limits.getQueries());
        System.debug('Limit Query Locator '+System.limits.getLimitQueryLocatorRows() + ' / ' + System.limits.getQueryLocatorRows());
        System.debug('Limit Query Rows '+System.limits.getLimitQueryRows() + ' / ' + System.limits.getQueryRows());
        System.debug('Limit RunAs '+System.limits.getLimitRunAs() + ' / ' + System.limits.getRunAs());
        System.debug('Limit Save Point Rollback '+System.limits.getLimitSavepointRollbacks() + ' / ' + System.limits.getSavepointRollbacks());
        System.debug('Limit Save Point '+System.limits.getLimitSavepoints() + ' / ' + System.limits.getSavepoints());
        System.debug('Limit SOSL Queries '+System.limits.getLimitSoslQueries() + ' / ' + System.limits.getSoslQueries());
    }
}