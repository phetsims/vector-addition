// Copyright 2019-2023, University of Colorado Boulder

/**
 * VectorSet is the model for a related set of vectors, and contains:
 *
 *  - an ObservableArrayDef of vectors
 *  - a sum vector of those vectors
 *  - a color palette that is common to all vectors
 *
 * A Graph can support multiple VectorSets. (e.g. Lab screen has 2 VectorSets per Graph)
 *
 * @author Brandon Li
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import vectorAddition from '../../vectorAddition.js';
import VectorAdditionConstants from '../VectorAdditionConstants.js';
import ComponentVectorStyles from './ComponentVectorStyles.js';
import SumVector from './SumVector.js';
import VectorColorPalette from './VectorColorPalette.js';

// The symbol for the sum vector.
// The reason this isn't translatable is https://github.com/phetsims/vector-addition/issues/10.
const SUM_SYMBOL = 's';

export default class VectorSet {

  /**
   * @param {Graph} graph - the graph the VectorSet belongs to
   * @param {EnumerationProperty.<ComponentVectorStyles>} componentStyleProperty - component style for all vectors
   * @param {BooleanProperty} sumVisibleProperty - controls whether the sum vector is visible
   * @param {VectorColorPalette} vectorColorPalette - color palette for vectors in this set
   * @param {Object} [options]
   */
  constructor( graph, componentStyleProperty, sumVisibleProperty, vectorColorPalette, options ) {

    // Compute values for the options that are related to the PROJECTION style component vectors.
    // See https://github.com/phetsims/vector-addition/issues/225
    const viewHeadWidth = VectorAdditionConstants.COMPONENT_VECTOR_ARROW_OPTIONS.headWidth;
    assert && assert( viewHeadWidth !== undefined, 'viewHeadWidth must be defined' );
    const modelHeadWidth = graph.modelViewTransformProperty.value.viewToModelDeltaX( viewHeadWidth );
    const axisSpacing = graph.modelViewTransformProperty.value.viewToModelDeltaX( 1.5 );
    const offsetStart = ( modelHeadWidth / 2 ) + axisSpacing;
    const offsetDelta = modelHeadWidth;

    options = merge( {

      // {boolean} false means that the default SumVector will not be created, and a subclass is responsible
      // for initializing this.sumVector.
      initializeSum: true,

      // {Vector2} initial tail position of the sum. Only used if options.initializeSum = true
      initialSumTailPosition: graph.graphModelBounds.center,

      // Offsets for primary component vectors in PROJECTION style
      projectionXOffsetStart: -offsetStart,
      projectionYOffsetStart: -offsetStart,
      projectionXOffsetDelta: -offsetDelta,
      projectionYOffsetDelta: -offsetDelta,

      // Offsets for sum component vectors in PROJECTION style
      sumProjectionXOffset: offsetStart,
      sumProjectionYOffset: offsetStart

    }, options );

    assert && assert( componentStyleProperty instanceof EnumerationProperty && ComponentVectorStyles.enumeration.includes( componentStyleProperty.value ),
      `invalid componentStyleProperty: ${componentStyleProperty}` );
    assert && assert( sumVisibleProperty instanceof BooleanProperty, `invalid sumVisibleProperty: ${sumVisibleProperty}` );
    assert && assert( vectorColorPalette instanceof VectorColorPalette, `invalid vectorColorPalette: ${vectorColorPalette}` );

    // @public {ObservableArrayDef.<Vector>} the vectors in the VectorSet
    // This array contains only what is referred to as main or parent vectors. It does not contain sum vectors,
    // component vectors, or base vectors.
    this.vectors = createObservableArray();

    // @public (read-only) {VectorColorPalette}
    this.vectorColorPalette = vectorColorPalette;

    // @public (read-only) {BooleanProperty} sumVisibleProperty
    this.sumVisibleProperty = sumVisibleProperty;

    // @public (read-only) {componentStyleProperty} componentStyleProperty
    this.componentStyleProperty = componentStyleProperty;

    // @public (read-only)
    this.projectionXOffsetStart = options.projectionXOffsetStart;
    this.projectionYOffsetStart = options.projectionYOffsetStart;
    this.sumProjectionXOffset = options.sumProjectionXOffset;
    this.sumProjectionYOffset = options.sumProjectionYOffset;

    if ( options.initializeSum ) {

      // @public (read-only)
      this.sumVector = new SumVector( options.initialSumTailPosition, graph, this, SUM_SYMBOL );
      this.sumVector.setProjectionOffsets( options.sumProjectionXOffset, options.sumProjectionYOffset );
    }

    // Whenever a vector is added or removed, adjust the offsets of all component vectors for PROJECTION style.
    // See https://github.com/phetsims/vector-addition/issues/225
    // unlink is unnecessary, since VectorSet own this.vectors.
    this.vectors.lengthProperty.link( length => {
      for ( let i = 0; i < length; i++ ) {
        const xOffset = options.projectionXOffsetStart + i * options.projectionXOffsetDelta;
        const yOffset = options.projectionYOffsetStart + i * options.projectionYOffsetDelta;
        this.vectors.get( i ).setProjectionOffsets( xOffset, yOffset );
      }
    } );
  }

  /**
   * @public
   */
  dispose() {
    assert && assert( false, 'VectorSet is not intended to be disposed' );
  }

  /**
   * Resets the VectorSet.  Called when the Reset All button is pressed.
   * @public
   */
  reset() {

    this.erase();

    assert && assert( this.sumVector, 'sumVector was never initialized' );
    this.sumVector.reset();
  }

  /**
   * Erases all vectors (except the sum) from the VectorSet. Called when the eraser button is pressed.
   * @public
   */
  erase() {
    while ( this.vectors.length ) {
      this.vectors.pop().dispose();
    }
  }
}

vectorAddition.register( 'VectorSet', VectorSet );