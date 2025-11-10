// Copyright 2025, University of Colorado Boulder

/**
 * ResultantVector is the base class for a resultant vector, the vector that results from the combination of a set of
 * vectors. In the Explore 1D, Explore 2D, and Lab screens, the resultant vector is a sum. In the Equations screen,
 * computation of the resultant vector depends on the equation type that is selected.
 * This class was introduced for https://github.com/phetsims/vector-addition/issues/334.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import vectorAddition from '../../vectorAddition.js';
import { ComponentVectorStyle } from './ComponentVectorStyle.js';
import Graph from './Graph.js';
import Vector, { VectorOptions } from './Vector.js';
import VectorSet from './VectorSet.js';

type SelfOptions = {

  // Whether to instrument isDefinedProperty. It is not relevant in the Equations screen because vectors that
  // contribute to the resultant vector are always on the graph.
  isDefinedPropertyInstrumented?: boolean;
};

export type ResultantVectorOptions = SelfOptions &
  StrictOmit<VectorOptions, 'isRemovableFromGraph' | 'isTipDraggable' | 'isOnGraph' | 'isOnGraphPropertyInstrumented'>;

export default class ResultantVector extends Vector {

  // Whether the resultant vector is defined.
  public readonly isDefinedProperty: TReadOnlyProperty<boolean>;

  protected constructor( tailPosition: Vector2,
                         xyComponents: Vector2,
                         vectorSet: VectorSet,
                         graph: Graph,
                         selectedVectorProperty: Property<Vector | null>,
                         componentVectorStyleProperty: TReadOnlyProperty<ComponentVectorStyle>,
                         providedOptions: ResultantVectorOptions ) {

    const options = optionize<ResultantVectorOptions, SelfOptions, VectorOptions>()( {

      // SelfOptions
      isDefinedPropertyInstrumented: true,

      // VectorOptions
      isRemovableFromGraph: false, // Resultant vectors are not removable from the graph.
      isTipDraggable: false, // Resultant vectors are not draggable by the tip.
      isOnGraph: true, // Resultant vectors are always on the graph.
      isOnGraphPropertyInstrumented: false // Resultant vectors are always on the graph, so isOnGraphProperty never changes.
    }, providedOptions );

    super( tailPosition, xyComponents, vectorSet, graph, selectedVectorProperty, componentVectorStyleProperty, options );

    // Resultant vector is defined if there is at least one vector on the graph.
    this.isDefinedProperty = DerivedProperty.deriveAny( vectorSet.allVectors.map( vector => vector.isOnGraphProperty ),
      () => vectorSet.allVectors.filter( vector => vector.isOnGraphProperty.value ).length > 0, {
        tandem: options.tandem.createTandem( 'isDefinedProperty' ),
        phetioValueType: BooleanIO,
        phetioFeatured: true
      } );
  }
}

vectorAddition.register( 'ResultantVector', ResultantVector );